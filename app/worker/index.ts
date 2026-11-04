/**
 * Role Prep Worker: static assets first (pre-rendered pages, app shell, content
 * JSON); /api/* runs here first; any other unmatched page navigation gets the
 * app shell so client routes (/practice/..., /today) load and hydrate.
 */
interface Env {
  ASSETS: Fetcher;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      if (url.pathname === '/api/health') return json({ ok: true, service: 'roleprep' });
      // Planned: /api/transcribe, /api/feedback (see docs/06-app-architecture.md).
      return json({ error: 'not_found' }, 404);
    }

    const asset = await env.ASSETS.fetch(request);
    const isPage = request.method === 'GET' && (request.headers.get('accept') ?? '').includes('text/html');
    if (asset.status !== 404 || !isPage) return asset;

    // html_handling serves /__spa-fallback.html at /__spa-fallback (the .html URL redirects).
    const shell = await env.ASSETS.fetch(new Request(new URL('/__spa-fallback', url), request));
    return new Response(shell.body, { status: 200, headers: shell.headers });
  },
} satisfies ExportedHandler<Env>;
