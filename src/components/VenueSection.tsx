import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { getDirectionsUrl, getMapEmbedUrl } from '../lib/share';
import { Reveal } from './Reveal';

/**
 * Browsers do not match :focus on an iframe once focus has moved inside it, so
 * CSS alone cannot show keyboard users that they are on the map. The window
 * losing focus while the iframe is the active element tells us instead.
 */
function useIframeFocus() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const check = () => setFocused(document.activeElement === ref.current);
    const checkSoon = () => window.setTimeout(check, 0);
    window.addEventListener('blur', checkSoon);
    window.addEventListener('focus', check);
    document.addEventListener('focusin', check);
    return () => {
      window.removeEventListener('blur', checkSoon);
      window.removeEventListener('focus', check);
      document.removeEventListener('focusin', check);
    };
  }, []);

  return { ref, focused };
}

export function VenueSection() {
  const { venue, copy } = weddingConfig;
  const { ref, focused } = useIframeFocus();

  return (
    <section id="venue" className="section" aria-labelledby="venue-heading">
      <div className="wrap grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <Reveal>
          <MapPin size={36} className="text-kumkum" aria-hidden="true" />
          <h2 id="venue-heading" className="mt-3">
            {venue.name}
          </h2>
          <address className="mt-4 max-w-[38ch] text-lede not-italic text-ink-2">
            {venue.fullAddress}
          </address>
          <a
            className="btn btn-primary mt-6"
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Navigation size={18} aria-hidden="true" />
            {copy.venue.action}
          </a>
        </Reveal>
        <Reveal index={1} className="map-frame">
          <div data-focused={focused} className="map-frame__inner">
            <iframe
              ref={ref}
              src={getMapEmbedUrl()}
              title={`Map showing ${venue.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            {/* Sits behind the map, so the frame is never empty while it loads. */}
            <p className="map-frame__resting" aria-hidden="true">
              <MapPin size={28} />
              {venue.name}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
