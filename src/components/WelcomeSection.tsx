import { weddingConfig } from '../config/weddingConfig';
import { GaneshSeal, GoldDivider } from './Ornaments';
import { Reveal } from './Reveal';

export function WelcomeSection() {
  const { welcome } = weddingConfig.copy;
  return (
    <section className="section" aria-labelledby="welcome-heading">
      <Reveal className="wrap flex flex-col items-center text-center">
        <GaneshSeal size="clamp(6.5rem, 5rem + 6vw, 9.5rem)" />
        <h2 id="welcome-heading" className="mt-6">
          {welcome.heading}
        </h2>
        <GoldDivider className="mt-4" />
        <p className="mt-5 max-w-[30ch] font-display text-statement font-semibold leading-tight">
          {welcome.body}
        </p>
      </Reveal>
    </section>
  );
}
