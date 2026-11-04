import type { Config } from '@react-router/dev/config';
import { publicPaths } from './app/lib/content.server';

// No server rendering: the Worker only serves files and /api/*. Public pages
// (home, catalogue, topics, live sub-topics) are pre-rendered to real HTML at
// build time for search; everything else is the app shell (__spa-fallback.html).
export default {
  ssr: false,
  prerender: async () => publicPaths(),
} satisfies Config;
