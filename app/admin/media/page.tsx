import React from 'react'
import { MediaLibrary } from '@/components/admin/media/MediaLibrary'

export const metadata = {
    title: 'Media Library - Admin',
    description: 'Manage and optimize your portfolio assets.',
}

export default function MediaPage() {
    return (
        <div className="w-full">
            <MediaLibrary />
        </div>
    )
}