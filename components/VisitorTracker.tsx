'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { myAppHook } from '@/context/AppUtils';

export default function VisitorTracker() {
  const pathname = usePathname();
  const { user } = myAppHook();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // 1. Get or generate visitor_id
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          localStorage.setItem('visitor_id', visitorId);
        }

        // 2. Send to API route
        const response = await fetch('/api/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_url: pathname,
            visitor_id: visitorId,
            user_id: user?.id || null,
          }),
        });

        const result = await response.json();
        if (process.env.NODE_ENV === 'development') {
          console.log(`[VisitorTracker] Tracked ${pathname}:`, result.status);
        }
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };

    // Small delay to ensure page is settled and not tracking redirects
    const timeout = setTimeout(trackVisit, 500);
    return () => clearTimeout(timeout);
  }, [pathname, user?.id]);

  return null;
}
