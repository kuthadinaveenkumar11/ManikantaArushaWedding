import { useRef } from 'react';
import { m, useInView, useReducedMotion } from 'framer-motion';
import { weddingConfig } from '../config/weddingConfig';

/** A gold rule that draws itself outward from a central flourish, after the card's divider. */
export function GoldDivider({ className = '' }: { className?: string }) {
  const draw = {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: 1.1, ease: [0.22, 0.61, 0.36, 1] as const },
  };
  return (
    <svg
      viewBox="0 0 320 28"
      aria-hidden="true"
      className={`mx-auto block h-7 w-full max-w-80 text-gold-deep ${className}`}
    >
      <m.path d="M138 14H6" fill="none" stroke="currentColor" strokeWidth="1.2" {...draw} />
      <m.path d="M182 14H314" fill="none" stroke="currentColor" strokeWidth="1.2" {...draw} />
      <m.path
        d="M138 14c6-8 13-8 15-3s-3 7-6 4M182 14c-6-8-13-8-15-3s3 7 6 4M153 14c3 7 11 7 14 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        {...draw}
      />
      <path d="M160 4l3.4 4.6L160 13l-3.4-4.4z" fill="currentColor" />
    </svg>
  );
}

/** The dome and spire that crown each arch. */
export function Finial({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 40" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 0l1.6 8h-3.2zM9.4 9h5.2l.8 3H8.6zM12 13c5 1.5 8.5 5 8.5 10 0 3-1.2 5-2.8 6.5H6.3C4.7 28 3.5 26 3.5 23c0-5 3.5-8.5 8.5-10zM4 31h16l2 4H2zM0 36h24v4H0z" />
    </svg>
  );
}

/** The Tirunamam of Lord Venkateswara, as it appears on the card's temple tower. */
export function Namam({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 56" aria-hidden="true" className={className}>
      <path
        d="M6 2h9c0 16 2 28 9 36 7-8 9-20 9-36h9c0 24-4 40-18 52C10 42 6 26 6 2z"
        fill="var(--color-raised)"
        stroke="var(--color-gold-deep)"
        strokeWidth="1.5"
      />
      <path d="M21.5 4h5c0 12-.6 22-2.5 30-1.9-8-2.5-18-2.5-30z" fill="var(--color-kumkum)" />
    </svg>
  );
}

/** The foil Ganesh from the printed front cover. */
export function GaneshSeal({ size, className = '' }: { size?: string; className?: string }) {
  const { emblem } = weddingConfig;
  return (
    <span
      className={`seal ${className}`}
      style={size ? ({ '--seal-size': size } as React.CSSProperties) : undefined}
    >
      <img src={emblem.src} width={emblem.width} height={emblem.height} alt="" decoding="async" />
    </span>
  );
}

function Blossom({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <g fill="var(--color-blush)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse key={angle} cx="20" cy="10" rx="6.5" ry="9.5" transform={`rotate(${angle} 20 20)`} />
        ))}
      </g>
      <circle cx="20" cy="20" r="4" fill="var(--color-gold)" />
    </svg>
  );
}

/**
 * A few blossoms that drift twice when they come into view, then rest. They run
 * for under five seconds at a time, so nothing keeps moving beside the text.
 */
export function FloatingBlossoms() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const blossoms = [
    { className: 'absolute top-[33%] left-[4%] w-5 lg:top-[24%] lg:left-[2%] lg:w-8', drift: -14 },
    { className: 'absolute top-[24%] right-[4%] w-4 lg:top-[20%] lg:right-[3%] lg:w-6', drift: 12 },
  ];
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {blossoms.map(({ className, drift }) => (
        <m.div
          key={className}
          className={className}
          animate={
            inView && !reduced ? { y: [0, drift, 0], rotate: [0, drift, 0] } : { y: 0, rotate: 0 }
          }
          transition={{ duration: 2.4, repeat: 1, ease: 'easeInOut' }}
        >
          <Blossom />
        </m.div>
      ))}
    </div>
  );
}
