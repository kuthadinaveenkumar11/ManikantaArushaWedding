import { weddingConfig } from '../config/weddingConfig';
import { ShareInvitation } from './ShareInvitation';

export function Footer() {
  const { couple, event, copy } = weddingConfig;
  return (
    <footer id="share" className="on-stone py-12">
      <div className="wrap text-center">
        <p className="font-display text-statement leading-tight font-semibold">
          {couple.groom.shortName} &amp; {couple.bride.shortName}
        </p>
        <p className="mt-1 text-on-stone-2">
          <time dateTime={event.muhurthamIso}>{event.dateShort}</time>
        </p>
        <p className="mt-8 mb-4 text-lede">{copy.footer.shareHeading}</p>
        <ShareInvitation />
      </div>
    </footer>
  );
}
