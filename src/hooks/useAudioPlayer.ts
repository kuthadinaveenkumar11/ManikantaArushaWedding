import { useCallback, useEffect, useRef, useState } from 'react';

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

/**
 * Drives one <audio> element. Playback only ever starts from `toggle`, which is
 * called from a tap, so mobile browsers allow it and nothing autoplays.
 */
export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<AudioStatus>('idle');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlaying = () => setStatus('playing');
    const onWaiting = () => setStatus('loading');
    // Also fires when the system interrupts playback, such as an incoming call.
    // Browsers send it straight after a load error, which must not hide the failure.
    const onPause = () => setStatus(audio.error ? 'error' : 'paused');
    const onError = () => setStatus('error');

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // A failed play() can leave `paused` false, so check for failure first:
    // the element stays failed until it is loaded again, and a tap means retry.
    if (audio.error) {
      audio.load();
    } else if (!audio.paused) {
      audio.pause();
      return;
    }

    setStatus('loading');
    try {
      await audio.play();
    } catch (error) {
      // A quick pause interrupts play() with an AbortError, which is not a failure.
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setStatus('error');
    }
  }, []);

  return { audioRef, status, toggle };
}
