import type { LucideIcon } from 'lucide-react';
import { BookOpen, CalendarDays, Heart, Home, MapPin, Share2 } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { useScrollSpy } from '../hooks/useScrollSpy';

const LINKS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'couple', label: 'Couple', icon: Heart },
  { id: 'details', label: 'Details', icon: CalendarDays },
  { id: 'venue', label: 'Venue', icon: MapPin },
  { id: 'card', label: 'Card', icon: BookOpen },
  { id: 'share', label: 'Share', icon: Share2 },
];

const IDS = LINKS.map((link) => link.id);

/** A thumb-reach dock on phones, and links split around the monogram from tablet up. */
export function SiteNav() {
  const { groom, bride } = weddingConfig.couple;
  const activeId = useScrollSpy(IDS);

  return (
    <nav className="site-nav" aria-label="Sections">
      <ul className="site-nav__list">
        {LINKS.map(({ id, label, icon: Icon }) => (
          <li key={id} className="site-nav__item">
            <a className="site-nav__link" href={`#${id}`} aria-current={activeId === id ? 'true' : undefined}>
              <Icon size={20} aria-hidden="true" />
              {label}
            </a>
          </li>
        ))}
        <li className="site-nav__monogram" aria-hidden="true">
          {groom.shortName[0]} &amp; {bride.shortName[0]}
        </li>
      </ul>
    </nav>
  );
}
