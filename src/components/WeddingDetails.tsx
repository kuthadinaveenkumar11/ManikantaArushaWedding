import type { LucideIcon } from 'lucide-react';
import { CalendarDays, Clock, Landmark, MapPin, UtensilsCrossed } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { Reveal } from './Reveal';

interface DetailCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  note?: string;
  wide?: boolean;
  /** Long text, set in the reading face so it stays compact. */
  prose?: boolean;
  index: number;
}

/** Keeps "19 November 2026" on one line, however the rest of the value wraps. */
const keepDateTogether = (text: string) => text.replace(/(\d{1,2}) (\w+) (\d{4})/, '$1\u00A0$2\u00A0$3');

function DetailCard({ icon: Icon, label, value, note, wide, prose, index }: DetailCardProps) {
  return (
    <Reveal index={index} className={`detail-card ${wide ? 'detail-card--wide' : ''}`}>
      <dt>
        <Icon size={18} aria-hidden="true" />
        {label}
      </dt>
      <dd className={prose ? 'detail-card__prose' : undefined}>
        {value}
        {note && <span className="detail-card__note">{note}</span>}
      </dd>
    </Reveal>
  );
}

export function WeddingDetails() {
  const { event, venue, copy } = weddingConfig;
  return (
    <section id="details" className="section bg-paper-2" aria-labelledby="details-heading">
      <div className="wrap">
        <h2 id="details-heading">{copy.details.heading}</h2>
        <dl className="detail-grid mt-10">
          <DetailCard wide index={0} icon={CalendarDays} label="Wedding date" value={keepDateTogether(event.dateFull)} />
          <DetailCard
            wide
            index={1}
            icon={Clock}
            label="Muhurtham"
            value={event.muhurtham}
            note={event.lagnam}
          />
          <DetailCard index={2} icon={Landmark} label="Venue" value={venue.name} />
          <DetailCard index={3} icon={MapPin} label="Address" value={venue.address} prose />
          <DetailCard index={4} icon={UtensilsCrossed} label="Lunch" value={event.lunch} />
        </dl>
      </div>
    </section>
  );
}
