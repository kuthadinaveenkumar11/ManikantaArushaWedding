import { useEffect, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { weddingConfig } from '../config/weddingConfig';
import { GaneshSeal } from './Ornaments';

type Stage = 'closed' | 'unsealing' | 'rising' | 'leaving';

interface InvitationEnvelopeProps {
  /** The Home View begins to show through. */
  onReveal: () => void;
  /** The envelope has fully gone. */
  onDone: () => void;
}

const EASE = [0.45, 0.05, 0.25, 1] as const;

// Each stage's length in milliseconds, before the next begins.
const UNSEAL_MS = 900;
const RISE_MS = 950;

export function InvitationEnvelope({ onReveal, onDone }: InvitationEnvelopeProps) {
  const { couple, event, copy } = weddingConfig;
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>('closed');

  useEffect(() => {
    if (stage === 'unsealing') {
      const timer = window.setTimeout(() => setStage('rising'), UNSEAL_MS);
      return () => window.clearTimeout(timer);
    }
    if (stage === 'rising') {
      const timer = window.setTimeout(() => setStage('leaving'), RISE_MS);
      return () => window.clearTimeout(timer);
    }
    if (stage === 'leaving') onReveal();
    return undefined;
  }, [stage, onReveal]);

  const open = () => setStage(reduced ? 'leaving' : 'unsealing');
  const isOpen = stage !== 'closed';
  const flapBehind = stage === 'rising' || stage === 'leaving';

  return (
    <m.div
      className="envelope-screen"
      role="region"
      aria-label={`Wedding invitation of ${couple.groom.shortName} and ${couple.bride.shortName}`}
      animate={{ opacity: stage === 'leaving' ? 0 : 1 }}
      transition={{ duration: reduced ? 0.25 : 0.75, ease: 'easeInOut' }}
      onAnimationComplete={() => {
        if (stage === 'leaving') onDone();
      }}
    >
      <div className="garland" aria-hidden="true" />
      <div className="botanical" aria-hidden="true" />

      <m.div
        className="envelope"
        animate={stage === 'leaving' && !reduced ? { y: 24, scale: 1.04 } : { y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: EASE }}
      >
        <div className="env-back" aria-hidden="true" />

        <m.div
          className="env-card"
          aria-hidden="true"
          animate={{ y: flapBehind ? '-44%' : '0%' }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <span className="env-card__heading">{copy.envelope.cardHeading}</span>
          <span className="env-card__names">
            {couple.groom.shortName} &amp; {couple.bride.shortName}
          </span>
        </m.div>

        <m.div
          className="env-flap"
          aria-hidden="true"
          style={{ zIndex: flapBehind ? 1 : 5, originY: 0, transformPerspective: 900 }}
          animate={{ rotateX: isOpen ? -180 : 0 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.12 }}
        >
          <div className="env-flap__face env-flap__face--front" />
          <div className="env-flap__face env-flap__face--back" />
        </m.div>

        <div className="env-front">
          <p className="env-names">
            {couple.groom.shortName}
            <span className="env-amp">&amp;</span>
            {couple.bride.shortName}
          </p>
          <p className="env-date">{event.dateShort}</p>
        </div>

        <svg className="env-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 0L50 48L100 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="env-border" aria-hidden="true" />

        <AnimatePresence>
          {!isOpen && (
            <m.div
              className="env-seal"
              aria-hidden="true"
              exit={{ opacity: 0, scale: 1.12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <GaneshSeal />
            </m.div>
          )}
        </AnimatePresence>
      </m.div>

      <m.button
        type="button"
        className="btn btn-primary"
        onClick={open}
        disabled={isOpen}
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {copy.envelope.openLabel}
      </m.button>
    </m.div>
  );
}
