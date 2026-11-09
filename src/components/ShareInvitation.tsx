import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Link as LinkIcon, MessageCircle, Share2 } from 'lucide-react';
import { buildShareText, weddingConfig } from '../config/weddingConfig';
import { copyToClipboard, getInvitationUrl, getWhatsAppUrl } from '../lib/share';

type CopyState = 'idle' | 'copied' | 'failed';

export function ShareInvitation() {
  const url = useMemo(getInvitationUrl, []);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [canShare, setCanShare] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
    return () => window.clearTimeout(resetTimer.current);
  }, []);

  const copyLink = async () => {
    const copied = await copyToClipboard(url);
    setCopyState(copied ? 'copied' : 'failed');
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState('idle'), copied ? 2500 : 8000);
  };

  const shareNatively = async () => {
    try {
      await navigator.share({
        title: weddingConfig.copy.meta.title,
        text: buildShareText(),
        url,
      });
    } catch (error) {
      // Closing the share sheet is a normal choice. Anything else falls back to copying.
      if (error instanceof DOMException && error.name === 'AbortError') return;
      await copyLink();
    }
  };

  return (
    <div>
      <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <a
          className="btn btn-primary"
          href={getWhatsAppUrl(url)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={18} aria-hidden="true" />
          Share on WhatsApp
        </a>
        <button type="button" className="btn btn-quiet" onClick={copyLink}>
          {copyState === 'copied' ? (
            <Check size={18} aria-hidden="true" />
          ) : (
            <LinkIcon size={18} aria-hidden="true" />
          )}
          Copy Invitation Link
        </button>
        {canShare && (
          <button type="button" className="btn btn-quiet" onClick={shareNatively}>
            <Share2 size={18} aria-hidden="true" />
            More ways to share
          </button>
        )}
      </div>
      <p className="mt-3 min-h-[1lh] text-center text-label break-words text-on-stone-2" aria-live="polite">
        {copyState === 'copied' && 'Link copied.'}
        {copyState === 'failed' && `Could not copy automatically. The link is ${url}`}
      </p>
    </div>
  );
}
