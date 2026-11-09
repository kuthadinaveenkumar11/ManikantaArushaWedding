import { useCallback, useEffect, useRef, useState } from 'react';

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

/**
 * Drives one <audio> element. Browsers only allow sound to start from a tap or
 * click, so `play` and `toggle` must be called directly from one. Calling them
 * after a timer or animation would be refused on phones.
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
      audio.pause();
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // A failed element stays failed until it is loaded again.
    if (audio.error) audio.load();
    // A track that has played to its end starts again from the beginning.
    if (audio.ended) audio.currentTime = 0;

    setStatus('loading');
    try {
      await audio.play();
    } catch (error) {
      const reason = error instanceof DOMException ? error.name : '';
      // A quick pause interrupts play() with an AbortError, which is not a failure.
      if (reason === 'AbortError') return;
      // The browser refused to start the sound. The drum still offers it, so this is not a failure.
      setStatus(reason === 'NotAllowedError' ? 'idle' : 'error');
    }
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // A failed play() can leave `paused` false, so a tap after a failure always means retry.
    if (!audio.error && !audio.paused) {
      audio.pause();
      return;
    }
    void play();
  }, [play]);

  return { audioRef, status, play, toggle };
}

export type AudioPlayer = ReturnType<typeof useAudioPlayer>;
