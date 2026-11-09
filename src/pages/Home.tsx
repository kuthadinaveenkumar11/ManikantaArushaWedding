import { useCallback, useEffect, useState } from 'react';
import { BlessingsSection } from '../components/BlessingsSection';
import { CoupleSection } from '../components/CoupleSection';
import { Countdown } from '../components/Countdown';
import { FamilySection } from '../components/FamilySection';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';
import { InvitationEnvelope } from '../components/InvitationEnvelope';
import { InvitationGallery } from '../components/InvitationGallery';
import { MusicPlayer } from '../components/MusicPlayer';
import { SiteNav } from '../components/SiteNav';
import { VenueSection } from '../components/VenueSection';
import { WeddingDetails } from '../components/WeddingDetails';
import { WelcomeSection } from '../components/WelcomeSection';

/** A guest opens the envelope, and the Home View shows through as it lifts. */
type Phase = 'envelope' | 'revealing' | 'site';

const isReload = () => {
  const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  return navigation?.type === 'reload';
};

/** A fresh link straight to a section, such as /#venue, skips the envelope and goes there. */
const startsOnSection = () => window.location.hash.length > 1 && !isReload();

const sectionFromAddress = () =>
  window.location.hash.length > 1 ? document.getElementById(window.location.hash.slice(1)) : null;

function useLandingPosition() {
  useEffect(() => {
    // Without this, browsers put a refreshed page back wherever it had been scrolled to.
    window.history.scrollRestoration = 'manual';

    const section = startsOnSection() ? sectionFromAddress() : null;
    if (section) {
      section.scrollIntoView({ behavior: 'instant' });
    } else {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Manual restoration also turns off the Back and Forward jumps, so do those here.
    const onHistoryMove = () => {
      const target = sectionFromAddress();
      if (target) target.scrollIntoView();
      else window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', onHistoryMove);
    return () => window.removeEventListener('popstate', onHistoryMove);
  }, []);
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>(() => (startsOnSection() ? 'site' : 'envelope'));
  const opened = phase !== 'envelope';

  useLandingPosition();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('scroll-locked', phase !== 'site');
    return () => root.classList.remove('scroll-locked');
  }, [phase]);

  const onReveal = useCallback(() => setPhase('revealing'), []);
  const onDone = useCallback(() => {
    setPhase('site');
    document.getElementById('main')?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      {opened && (
        <a className="skip-link" href="#main">
          Skip to content
        </a>
      )}

      {phase !== 'site' && <InvitationEnvelope onReveal={onReveal} onDone={onDone} />}

      <div className="site-frame" inert={!opened}>
        <SiteNav />
        <main id="main" tabIndex={-1} className="outline-none">
          <HeroSection show={opened} />
          <WelcomeSection />
          <CoupleSection />
          <Countdown />
          <WeddingDetails />
          <VenueSection />
          <InvitationGallery />
          <FamilySection />
          <BlessingsSection />
        </main>
        <Footer />
      </div>

      <MusicPlayer visible={opened} />
    </>
  );
}
