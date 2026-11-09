import { m } from 'framer-motion';
import { weddingConfig } from '../config/weddingConfig';
import { ArchPhoto } from './ArchPhoto';
import { FloatingBlossoms } from './Ornaments';

/** One settle after the envelope lifts: a fade with a short rise, staggered. */
function Settle({
  show,
  index,
  className,
  children,
}: {
  show: boolean;
  index: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}

export function HeroSection({ show }: { show: boolean }) {
  const { couple, event, copy } = weddingConfig;
  const archSizes = '(min-width: 64rem) 22vw, 46vw';

  return (
    <section id="home" className="hero" aria-labelledby="hero-names">
      <div className="garland" aria-hidden="true" />
      <div className="temple-watermark" aria-hidden="true" />
      <FloatingBlossoms />

      <div className="hero__grid wrap">
        <Settle show={show} index={0} className="hero__text">
          <p className="hero__blessing">{copy.hero.blessing}</p>
          <p className="mx-auto mt-2 max-w-[34ch] text-lede leading-snug text-ink-2">
            {copy.hero.invitation}
          </p>
          <h1 id="hero-names" className="hero__names">
            <span>{couple.groom.name}</span>
            <span className="hero__amp">&amp;</span>
            <span>{couple.bride.name}</span>
          </h1>
        </Settle>

        <Settle show={show} index={1} className="hero__arch-groom pt-4">
          <ArchPhoto photo={couple.groom.archPhoto} priority sizes={archSizes} />
        </Settle>
        <Settle show={show} index={2} className="hero__arch-bride pt-4">
          <ArchPhoto photo={couple.bride.archPhoto} priority sizes={archSizes} />
        </Settle>

        <Settle show={show} index={3} className="hero__meta">
          <ul className="hero__facts">
            <li>
              <time dateTime={event.muhurthamIso}>{event.dateShort}</time>
            </li>
            <li>{event.muhurtham}</li>
            <li>{event.city}</li>
          </ul>
          <a className="btn btn-primary min-w-44" href="#details">
            {copy.hero.action}
          </a>
        </Settle>
      </div>

      <div className="balustrade" aria-hidden="true" />
    </section>
  );
}
