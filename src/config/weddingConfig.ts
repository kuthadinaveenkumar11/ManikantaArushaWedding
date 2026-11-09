/**
 * The one file to edit for wedding facts: names, dates, venue, families,
 * photographs, music, wording and sharing messages. Components read from here
 * and never hard-code these details.
 *
 * Spellings follow the printed card (Anusha, Yedida).
 */

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface InvitationPage {
  id: string;
  label: string;
  src: string;
  preview: string;
  previewWidth: number;
  width: number;
  height: number;
  alt: string;
}

export const weddingConfig = {
  couple: {
    groom: {
      name: 'Manikanta Kali Shiva Prakash',
      shortName: 'Manikanta',
      role: 'The groom',
      relation: 'Only son of',
      parents: ['Late Sri Yedida Venkata Ramana', 'Smt. Surya Kumari'],
      /** Tight crop for the hero's arch. */
      archPhoto: {
        src: new URL('../assets/images/couple/groom-arch.webp', import.meta.url).href,
        width: 482,
        height: 643,
        alt: 'Manikanta smiling in a white shirt beneath green leaves',
      } satisfies Photo,
      /** Larger crop for the couple section. */
      portrait: {
        src: new URL('../assets/images/couple/groom-portrait.webp', import.meta.url).href,
        width: 654,
        height: 818,
        alt: 'Portrait of Manikanta Kali Shiva Prakash in a white shirt',
      } satisfies Photo,
    },
    bride: {
      name: 'Anusha',
      shortName: 'Anusha',
      role: 'The bride',
      relation: 'Elder daughter of',
      parents: ['Sri Seelamanthula Nagaiah', 'Smt. Swaroopa'],
      archPhoto: {
        src: new URL('../assets/images/couple/bride-arch.webp', import.meta.url).href,
        width: 560,
        height: 747,
        alt: 'Anusha smiling in a green and orange silk saree',
      } satisfies Photo,
      portrait: {
        src: new URL('../assets/images/couple/bride-portrait.webp', import.meta.url).href,
        width: 800,
        height: 1000,
        alt: 'Portrait of Anusha in a green and orange silk saree with gold jewellery',
      } satisfies Photo,
    },
  },

  event: {
    /** The exact moment, with its offset. The countdown compares against this instant. */
    muhurthamIso: '2026-11-19T09:46:00+05:30',
    timeZone: 'Asia/Kolkata',
    dateFull: 'Thursday, 19 November 2026',
    dateShort: '19 November 2026',
    muhurtham: '9:46 AM',
    muhurthamWithZone: '9:46 AM IST',
    lagnam: 'Dhanassu Lagnam',
    city: 'Hyderabad',
    lunch: '12:00 PM onwards',
  },

  venue: {
    name: 'Sri Maharaja Function Hall',
    /** As shown in the wedding details. */
    address: 'Gajularamaram, Beside HP Petrol Pump, Near Chitharamma Temple, Hyderabad',
    /** Used for the venue section and for finding the place on Google Maps. */
    fullAddress:
      'Gajularamaram, Beside HP Petrol Pump, Near Chitharamma Temple, Hyderabad, Telangana',
    /**
     * Leave null until the exact pin has been checked on site. While it is null,
     * Google Maps searches by name and address. To pin it, use e.g.
     * { lat: 17.0, lng: 78.0 } with the verified numbers.
     */
    coordinates: null as { lat: number; lng: number } | null,
  },

  family: {
    hostsLabel: 'Invited by',
    hosts: ['Sri Yedida Govinda Raju', 'Smt. Chandra Kumari'],
    compliments: 'With best compliments from: Near and Dear',
    groomSideLabel: 'The groom’s parents',
    brideSideLabel: 'The bride’s parents',
  },

  invitation: {
    /**
     * The two official photographs, kept in public/ and served byte for byte.
     * `preview` is a smaller copy of the same photograph for first display; the viewer
     * then switches to `src`. The first page is the front cover.
     */
    pages: [
      {
        id: 'cover',
        label: 'Front cover',
        src: '/wedding-invitation-cover.jpg',
        preview: '/wedding-invitation-cover-preview.webp',
        previewWidth: 1200,
        width: 1762,
        height: 2380,
        alt: 'Front cover of the printed card: a die-cut gold Ganesh medallion above Lord Venkateswara and his consort in twin gold arches, with a temple, cows and a peacock.',
      },
      {
        id: 'inside',
        label: 'Inner invitation',
        src: '/wedding-invitation-inside.jpg',
        preview: '/wedding-invitation-inside-preview.webp',
        previewWidth: 1600,
        width: 2116,
        height: 1492,
        alt: 'The complete inner invitation, English on the left and Telugu on the right. Wedding Invitation. We solicit your gracious presence with family and friends on the auspicious occasion of the wedding of Late Sri Yedida Venkata Ramana and Smt. Surya Kumari’s only son, Chi. Manikanta Kali Shiva Prakash, with Chi. La. Sow. Anusha, elder daughter of Sri Seelamanthula Nagaiah and Smt. Swaroopa. Sumuhurtham on Thursday 19th November 2026 at 9:46 a.m., Dhanassu Lagnam. Venue: Sri Maharaja Function Hall, Gajularamaram, Beside HP Petrol Pump, Chitharamma Temple, Hyderabad. Lunch: 12:00 noon onwards. Invited by Sri Yedida Govinda Raju and Smt. Chandra Kumari. With best compliments from: Near and Dear.',
      },
    ] satisfies InvitationPage[],
    /**
     * Where the printed cover's two doors meet, in percent of the photograph
     * (x, y from top to bottom). The opening animation follows this seam, so the
     * die-cut medallion swings with the left door as it does on the real card.
     * If you replace the cover, set this to [[50, 0], [50, 100]] for a straight split.
     */
    gateFold: {
      seam: [
        [49.6, 0],
        [49.6, 8.3],
        [56.7, 9],
        [62.8, 12],
        [66.5, 16.5],
        [69.5, 21.5],
        [71.6, 26],
        [70.2, 31],
        [70.2, 36.5],
        [68.2, 39.5],
        [67.9, 42.5],
        [64.1, 44],
        [59.4, 46.3],
        [56, 48],
        [57.4, 50.5],
        [54, 53.8],
        [50.3, 55.8],
        [50, 61.3],
        [50.3, 84],
        [50.3, 100],
      ] as [number, number][],
      hingeLeftPercent: 0,
      hingeRightPercent: 100,
    },
  },

  /** The gold Ganesh, cut from the card's own front cover. */
  emblem: {
    src: new URL('../assets/images/ganesh-seal.webp', import.meta.url).href,
    width: 360,
    height: 360,
  },

  music: {
    /**
     * The background music, kept in public/audio/ and served byte for byte. To change
     * the track, overwrite that file. Set this to null to hide the floating drum.
     */
    src: '/audio/wedding-music.mp3' as string | null,
  },

  copy: {
    meta: {
      title: 'Manikanta & Anusha | Wedding Invitation | 19 November 2026',
      description:
        'You are invited to the wedding of Manikanta Kali Shiva Prakash and Anusha on Thursday, 19 November 2026 at 9:46 AM, at Sri Maharaja Function Hall, Hyderabad.',
      imageAlt: 'Manikanta and Anusha wedding invitation, 19 November 2026, Hyderabad',
    },
    envelope: {
      cardHeading: 'Wedding Invitation',
      openLabel: 'Open Invitation',
    },
    hero: {
      blessing: 'With the blessings of the Almighty',
      invitation: 'Together with our families, we invite you to celebrate our wedding.',
      action: 'View Wedding Details',
    },
    welcome: {
      heading: 'Wedding Invitation',
      body: 'We solicit your gracious presence with family & friends on this auspicious occasion.',
    },
    couple: {
      heading: 'The groom and the bride',
    },
    countdown: {
      heading: 'Until the muhurtham',
      completeHeading: 'The muhurtham has arrived',
      completeBody:
        'Today Manikanta and Anusha begin their married life. Please join us in blessing them.',
    },
    details: {
      heading: 'The wedding day',
    },
    venue: {
      action: 'Get Directions',
    },
    gallery: {
      heading: 'The card, as printed',
      body: 'Open the original invitation and turn its pages.',
      action: 'Open Card',
      close: 'Close Invitation',
      hintTouch: 'Swipe to turn the page. Pinch or double tap to zoom.',
      hintPointer: 'Use the arrow keys to turn the page. Scroll or double click to zoom.',
    },
    blessings: {
      heading: 'Shrirasthu. Shubhamasthu. Avignamasthu.',
      meaning: 'May there be prosperity, goodness and a path free of obstacles.',
      closing: 'Please come and bless Manikanta and Anusha in person.',
    },
    footer: {
      shareHeading: 'Share this invitation with family & friends',
    },
  },
} as const;

/** Prefilled text for WhatsApp, which understands *bold*. */
export function buildWhatsAppMessage(url: string): string {
  const { couple, event, venue } = weddingConfig;
  return [
    'With the blessings of the Almighty, we invite you to the wedding of',
    '',
    `*${couple.groom.name}* & *${couple.bride.name}*`,
    '',
    `Date: ${event.dateFull}`,
    `Muhurtham: ${event.muhurtham}`,
    `Venue: ${venue.name}, ${venue.address}`,
    '',
    `View the invitation: ${url}`,
  ].join('\n');
}

/** Plain text for the device share sheet, which adds the link by itself. */
export function buildShareText(): string {
  const { couple, event, venue } = weddingConfig;
  return `You are invited to the wedding of ${couple.groom.name} & ${couple.bride.name}. ${event.dateFull} at ${event.muhurtham}, ${venue.name}, ${event.city}.`;
}
