import { useEffect, useState } from 'react';
import { Loader2, RotateCcw } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { useAudioPlayer, type AudioStatus } from '../hooks/useAudioPlayer';

const STATUS_TEXT: Record<AudioStatus, string> = {
  idle: 'Play music',
  loading: 'Loading music',
  playing: 'Music playing',
  paused: 'Music paused',
  error: 'Could not play. Tap to retry',
};

/** How long the status label stays up after the state changes, for touch screens with no hover. */
const ANNOUNCE_MS = 2200;

/** A traditional dholak: sound arcs show while it plays, a slash while it is silent. */
function DrumIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="music-drum">
      <g transform="rotate(-14 24 26)">
        <g className="music-drum__body">
          <path
            className="music-drum__shell"
            d="M9 17C15 13.5 33 13.5 39 17V35C33 38.5 15 38.5 9 35Z"
          />
          <path
            className="music-drum__lacing"
            d="M13 17.5L20 35.5L27 15.5L35 34.5M13 34.5L20 16.5L27 36.5L35 17.5"
          />
          <path
            className="music-drum__band"
            d="M13.5 15.5C15 21 15 31 13.5 36.5M34.5 15.5C33 21 33 31 34.5 36.5"
          />
          <ellipse className="music-drum__head" cx="9" cy="26" rx="4" ry="9.5" />
          <ellipse className="music-drum__head music-drum__head--far" cx="39" cy="26" rx="3.5" ry="9.5" />
        </g>
      </g>
      <g className="music-drum__waves">
        <path d="M35.5 9.5A6.5 6.5 0 0 1 42 16" />
        <path d="M35.5 4.5A11.5 11.5 0 0 1 47 16" />
      </g>
      <g className="music-drum__slash">
        <path className="music-drum__slash-halo" d="M7 8L41 44" />
        <path className="music-drum__slash-line" d="M7 8L41 44" />
      </g>
    </svg>
  );
}

/**
 * Stays mounted for the whole visit, above every section, with one audio element,
 * so the music keeps going while guests scroll and jump between sections. It
 * renders nothing if no audio file is set in the wedding config.
 */
export function MusicPlayer({ visible }: { visible: boolean }) {
  const { src } = weddingConfig.music;
  const { audioRef, status, toggle } = useAudioPlayer();
  const [announcing, setAnnouncing] = useState(false);

  useEffect(() => {
    if (status === 'idle') return undefined;
    setAnnouncing(true);
    const timer = window.setTimeout(() => setAnnouncing(false), ANNOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  if (!src) return null;

  const isPlaying = status === 'playing';

  return (
    <>
      <audio ref={audioRef} src={src} preload="none" loop playsInline />
      {visible && (
        <button
          type="button"
          className="music-control"
          aria-pressed={isPlaying}
          aria-label={`${isPlaying ? 'Pause' : 'Play'} wedding music. ${STATUS_TEXT[status]}.`}
          data-status={status}
          data-announcing={announcing}
          onClick={toggle}
        >
          <DrumIcon />
          {status === 'loading' && (
            <span className="music-control__badge" aria-hidden="true">
              <Loader2 size={14} className="spin" />
            </span>
          )}
          {status === 'error' && (
            <span className="music-control__badge" aria-hidden="true">
              <RotateCcw size={14} />
            </span>
          )}
          <span className="music-control__label" aria-hidden="true">
            {STATUS_TEXT[status]}
          </span>
        </button>
      )}
    </>
  );
}
