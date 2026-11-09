import { weddingConfig } from '../config/weddingConfig';
import { ArchPhoto } from './ArchPhoto';
import { Reveal } from './Reveal';

type Person = (typeof weddingConfig.couple)['groom' | 'bride'];

function Profile({ person, index, className }: { person: Person; index: number; className: string }) {
  return (
    <Reveal index={index} className={className}>
      <article>
        <div className="mx-auto max-w-[26rem] pt-8">
          <ArchPhoto
            photo={person.portrait}
            lift
            sizes="(min-width: 48rem) 40vw, (min-width: 26rem) 26rem, 90vw"
          />
        </div>
        <div className="mx-auto mt-6 max-w-[26rem] text-center">
          <p className="text-label font-semibold text-gold-ink">{person.role}</p>
          <h3 className="mt-1 text-title">{person.name}</h3>
          <p className="mt-3 text-ink-2">{person.relation}</p>
          <p className="font-display text-[1.375rem] leading-snug font-semibold">
            {person.parents.map((parent) => (
              <span key={parent} className="block">
                {parent}
              </span>
            ))}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

export function CoupleSection() {
  const { couple, copy } = weddingConfig;
  return (
    <section id="couple" className="section bg-paper-2" aria-labelledby="couple-heading">
      <div className="wrap">
        <h2 id="couple-heading" className="text-center md:text-left">
          {copy.couple.heading}
        </h2>
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-14 md:grid-cols-[repeat(2,minmax(0,1fr))] md:gap-10">
          <Profile person={couple.groom} index={0} className="min-w-0" />
          <Profile person={couple.bride} index={1} className="min-w-0 md:mt-24" />
        </div>
      </div>
    </section>
  );
}
