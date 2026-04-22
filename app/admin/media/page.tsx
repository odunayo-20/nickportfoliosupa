import React from 'react'
import { MediaLibrary } from '@/components/admin/media/MediaLibrary'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Media Library | Nikola',
    description: 'Media Library for Nikola Portfolio',
}

export default function MediaPage() {
    return (
        <div className="w-full">
            <MediaLibrary />
        </div>
    )
}