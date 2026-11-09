import { buildWhatsAppMessage, weddingConfig } from '../config/weddingConfig';

/** The production address when known, otherwise wherever the page is being served. */
export function getInvitationUrl(): string {
  return __SITE_URL__ || window.location.origin;
}

/** wa.me opens the app on phones and WhatsApp Web on computers. */
export function getWhatsAppUrl(url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(buildWhatsAppMessage(url))}`;
}

/** Copies text, with a fallback for browsers or contexts without the Clipboard API. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }
    field.remove();
    return copied;
  }
}

/**
 * Opens Google Maps: the app on phones where it is installed, a new tab elsewhere.
 * Uses verified coordinates when set, otherwise the venue's name and address.
 */
export function getDirectionsUrl(): string {
  const { name, fullAddress, coordinates } = weddingConfig.venue;
  const destination = coordinates
    ? `${coordinates.lat},${coordinates.lng}`
    : `${name}, ${fullAddress}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function getMapEmbedUrl(): string {
  const { name, fullAddress, coordinates } = weddingConfig.venue;
  const query = coordinates ? `${coordinates.lat},${coordinates.lng}` : `${name}, ${fullAddress}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
