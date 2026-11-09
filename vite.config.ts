import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { weddingConfig } from './src/config/weddingConfig.ts';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Fills index.html from the wedding config, so the preview tags and the
 * no-script fallback can never disagree with the page.
 */
function weddingHtml(siteUrl: string): Plugin {
  const { copy, couple, event, venue, family } = weddingConfig;
  const parents = (people: readonly string[]) => people.join(' and ');
  const noscript = `
      <main style="max-width:36rem;margin:0 auto;padding:2rem 1rem;text-align:center;font-family:Georgia,serif;color:#3f1f17">
        <p>${escapeHtml(copy.hero.blessing)}</p>
        <h1>${escapeHtml(couple.groom.name)} &amp; ${escapeHtml(couple.bride.name)}</h1>
        <p>${escapeHtml(copy.hero.invitation)}</p>
        <p><strong>${escapeHtml(event.dateFull)}</strong><br />Muhurtham: ${escapeHtml(event.muhurtham)}<br />Lunch: ${escapeHtml(event.lunch)}</p>
        <p><strong>${escapeHtml(venue.name)}</strong><br />${escapeHtml(venue.fullAddress)}</p>
        <p>${escapeHtml(couple.groom.relation)} ${escapeHtml(parents(couple.groom.parents))}<br />${escapeHtml(couple.bride.relation)} ${escapeHtml(parents(couple.bride.parents))}</p>
        <p>${escapeHtml(family.hostsLabel)} ${escapeHtml(parents(family.hosts))}</p>
      </main>`;
  const absolute = (path: string) => `${siteUrl}${path}`;
  const values: Record<string, string> = {
    '{{TITLE}}': escapeHtml(copy.meta.title),
    '{{DESCRIPTION}}': escapeHtml(copy.meta.description),
    '{{IMAGE_ALT}}': escapeHtml(copy.meta.imageAlt),
    '{{OG_IMAGE}}': absolute('/og-image.jpg'),
    '{{SITE_URL}}': siteUrl || '/',
    '<!--{{NOSCRIPT}}-->': `<noscript>${noscript}\n    </noscript>`,
  };
  return {
    name: 'wedding-html',
    transformIndexHtml(html) {
      return Object.entries(values).reduce(
        (result, [token, value]) => result.split(token).join(value),
        html,
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // An explicit address wins; otherwise use the production address Vercel provides at build time.
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = (env.VITE_SITE_URL || (vercelHost ? `https://${vercelHost}` : '')).replace(
    /\/$/,
    '',
  );

  return {
    plugins: [react(), tailwindcss(), weddingHtml(siteUrl)],
    define: {
      __SITE_URL__: JSON.stringify(siteUrl),
    },
  };
});
