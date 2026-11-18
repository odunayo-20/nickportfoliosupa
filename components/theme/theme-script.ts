export const THEME_STORAGE_KEY = 'theme'

/** Class on <html> marking the public site; dark tokens only apply under it (admin stays light). */
export const SITE_CLASS = 'site'

/**
 * Runs before first paint (inlined in <head> by app/layout.tsx): applies the saved choice or
 * the OS setting so there's no flash of the wrong theme, and marks public pages with `html.site`.
 * (A class instead of `:root:has(.site-root)` — a root-level :has() made every DOM insertion
 * re-style the whole page, ~45x slower.) Keep it tiny and dependency-free.
 */
export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement;try{if(!/^\\/(admin|auth)(\\/|$)/.test(location.pathname))d.classList.add('${SITE_CLASS}');var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.dataset.theme=t}catch(e){d.dataset.theme='light'}})()`
