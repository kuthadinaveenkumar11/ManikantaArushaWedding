import type { ReactNode } from 'react';
import { m } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Position in a staggered group. */
  index?: number;
}

/** The page's one section reveal: a short rise and fade, shown once. */
export function Reveal({ children, className, index = 0 }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
