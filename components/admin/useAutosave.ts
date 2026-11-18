'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import type { ZodType } from 'zod'

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error' | 'invalid'

type Options<T extends FieldValues> = {
  form: UseFormReturn<T>
  schema: ZodType
  delay: number
  /** Persist the values. Must NOT change publish status — autosave only stores drafts of fields. */
  save: (values: T) => Promise<void>
  /** Field names excluded from change detection (e.g. 'status', which only the Save button writes). */
  ignore?: (keyof T)[]
}

/**
 * Debounced autosave for react-hook-form editors.
 *
 * The old implementation depended on `watch()` (a fresh object every render) inside a
 * useEffect, so it re-armed after every render — including the renders its own "saving…" state
 * caused — and saved forever, publishing status changes and purging the public cache each time.
 *
 * This version subscribes to form changes, compares a snapshot against the last saved one,
 * validates before saving, and serialises saves (so a new item can't be created twice).
 */
export function useAutosave<T extends FieldValues>({ form, schema, delay, save, ignore = [] }: Options<T>) {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const snapshot = useCallback(
    (values: T) => {
      const copy: Record<string, unknown> = { ...values }
      for (const key of ignore) delete copy[key as string]
      return JSON.stringify(copy)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ignore.join('|')],
  )

  const savedRef = useRef<string>(snapshot(form.getValues()))
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inFlightRef = useRef<Promise<void>>(Promise.resolve())
  const saveRef = useRef(save)
  useEffect(() => {
    saveRef.current = save
  })

  const run = useCallback(async () => {
    // Wait for any save already running, so two saves never race (e.g. both creating a row).
    const previous = inFlightRef.current
    let release!: () => void
    inFlightRef.current = new Promise<void>((r) => (release = r))
    await previous

    try {
      const values = form.getValues()
      const snap = snapshot(values)
      if (snap === savedRef.current) {
        setStatus((s) => (s === 'dirty' ? 'saved' : s))
        return
      }
      if (!schema.safeParse(values).success) {
        setStatus('invalid')
        return
      }
      setStatus('saving')
      await saveRef.current(values)
      savedRef.current = snap
      setLastSaved(new Date())
      setStatus('saved')
    } catch (error) {
      console.error('Autosave failed:', error)
      setStatus('error')
    } finally {
      release()
    }
  }, [form, schema, snapshot])

  useEffect(() => {
    const sub = form.watch((values) => {
      if (snapshot(values as T) === savedRef.current) return
      setStatus('dirty')
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(run, delay)
    })
    return () => {
      sub.unsubscribe()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [form, delay, run, snapshot])

  /** Save immediately (e.g. after removing an image). */
  const flush = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    return run()
  }, [run])

  /** Call after a manual Save succeeded, so autosave doesn't re-send the same values. */
  const markSaved = useCallback(
    (values: T = form.getValues()) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      savedRef.current = snapshot(values)
      setLastSaved(new Date())
      setStatus('saved')
    },
    [form, snapshot],
  )

  /** Wait for a running autosave to finish (call before a manual save). */
  const settle = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    return inFlightRef.current
  }, [])

  const isDirty = status === 'dirty' || status === 'invalid' || status === 'error'

  // Warn before closing/reloading the tab with unsaved changes.
  useEffect(() => {
    if (!isDirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  return { status, setStatus, lastSaved, flush, markSaved, settle, isDirty }
}
