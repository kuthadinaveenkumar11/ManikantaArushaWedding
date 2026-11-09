import type { Photo } from '../config/weddingConfig';
import { Finial } from './Ornaments';

interface ArchPhotoProps {
  photo: Photo;
  /** The first screen's photographs load right away; the rest wait until needed. */
  priority?: boolean;
  lift?: boolean;
  sizes: string;
}

/** A photograph in a gold temple arch, echoing the twin shrines on the card's cover. */
export function ArchPhoto({ photo, priority = false, lift = false, sizes }: ArchPhotoProps) {
  return (
    <div className={`arch ${lift ? 'arch--lift' : ''}`}>
      <Finial className="arch__finial" />
      <div className="arch__mat">
        <div className="arch__window" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
          <img
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}
