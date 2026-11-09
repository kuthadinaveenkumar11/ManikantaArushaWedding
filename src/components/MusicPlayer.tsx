import { Loader2, Music, Pause, RotateCcw } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { useAudioPlayer, type AudioStatus } from '../hooks/useAudioPlayer';

const STATUS_TEXT: Record<AudioStatus, string> = {
  idle: 'Play music',
  loading: 'Loading',
  playing: 'Playing',
  paused: 'Paused',
  error: 'Could not play',
};

/**
 * Stays mounted for the whole visit, above every section, so the music keeps
 * going while guests scroll and jump between sections. It renders nothing
 * until a licensed audio file is set in the wedding config.
 */
export function MusicPlayer({ visible }: { visible: boolean }) {
  const { src } = weddingConfig.music;
  const { audioRef, status, toggle } = useAudioPlayer();

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
          onClick={toggle}
        >
          <span className="music-control__disc" aria-hidden="true">
            {status === 'loading' && <Loader2 size={16} className="spin" />}
            {status === 'playing' && (
              <span className="music-bars">
                <i />
                <i />
                <i />
              </span>
            )}
            {status === 'paused' && <Pause size={16} />}
            {status === 'idle' && <Music size={16} />}
            {status === 'error' && <RotateCcw size={16} />}
          </span>
          <span aria-hidden="true">{STATUS_TEXT[status]}</span>
        </button>
      )}
    </>
  );
}
