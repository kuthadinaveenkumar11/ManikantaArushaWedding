import { AnimatePresence, m } from 'framer-motion';
import { weddingConfig } from '../config/weddingConfig';
import { useCountdown } from '../hooks/useCountdown';
import { GoldDivider } from './Ornaments';
import { Reveal } from './Reveal';

function CountUnit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, '0');
  return (
    <div className="count-cell">
      <span className="count-value">
        <AnimatePresence initial={false} mode="wait">
          <m.span
            key={text}
            initial={{ opacity: 0, y: '-24%' }}
            animate={{ opacity: 1, y: '0%' }}
            exit={{ opacity: 0, y: '24%' }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
          >
            {text}
          </m.span>
        </AnimatePresence>
      </span>
      <span className="mt-1 text-label text-on-stone-2">{label}</span>
    </div>
  );
}

export function Countdown() {
  const { event, copy } = weddingConfig;
  const { days, hours, minutes, seconds, isComplete } = useCountdown(event.muhurthamIso);

  return (
    <section className="section on-stone" aria-labelledby="countdown-heading">
      <Reveal className="wrap text-center">
        {isComplete ? (
          <div role="status">
            <h2 id="countdown-heading">{copy.countdown.completeHeading}</h2>
            <GoldDivider className="mt-5 text-gold" />
            <p className="mx-auto mt-5 max-w-[34ch] font-display text-statement leading-tight font-semibold">
              {copy.countdown.completeBody}
            </p>
          </div>
        ) : (
          <>
            <h2 id="countdown-heading">{copy.countdown.heading}</h2>
            <div
              className="count-grid mx-auto mt-8 max-w-5xl"
              role="timer"
              aria-label={`${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds left`}
            >
              <CountUnit value={days} label="Days" />
              <CountUnit value={hours} label="Hours" />
              <CountUnit value={minutes} label="Minutes" />
              <CountUnit value={seconds} label="Seconds" />
            </div>
            <p className="mt-8 text-lede text-on-stone-2">
              {event.dateShort}, {event.muhurthamWithZone}
            </p>
          </>
        )}
      </Reveal>
    </section>
  );
}
