/* Service worker - PWA Jdev Tasas de Cambio
 * - Precachea el shell de la app
 * - Navegaciones: network-first con fallback offline
 * - Assets hashados: stale-while-revalidate
 * - DolarAPI: network-first con fallback a las últimas tasas cacheadas
 */
const STATIC_CACHE = 'jdev-static-v1';
const RATES_CACHE = 'jdev-rates-v1';
const API_HOST = 've.dolarapi.com';

const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const keep = [STATIC_CACHE, RATES_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !keep.includes(key)).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

// Navegación (HTML): network-first, si no hay red sirve el shell cacheado
async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put('/', response.clone());
    return response;
  } catch {
    const cached = await caches.match('/');
    if (cached) return cached;
    return new Response(
      '<!doctype html><html lang="es"><body style="background:#050505;color:#a3a3a3;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center"><div><h1>Sin conexión</h1><p>No hay una versión guardada de la app. Conéctate a internet una vez para poder usarla offline.</p></div></body></html>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

// Tasas (API externa): network-first, si falla devolver las últimas conocidas
async function handleRates(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RATES_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({ success: false, offline: true, data: [] }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Assets estáticos: cache-first + actualización en segundo plano
async function handleAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await caches.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) {
    // revalida en segundo plano sin bloquear la respuesta
    network.then(() => {});
    return cached;
  }
  const response = await network;
  if (response) return response;
  return new Response('Offline', { status: 503 });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (url.hostname === API_HOST) {
    event.respondWith(handleRates(request));
    return;
  }

  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith('/assets/')) {
      event.respondWith(handleAsset(request));
      return;
    }
    // resto de mismos orígenes (manifest, iconos, fuentes): stale-while-revalidate
    event.respondWith(handleAsset(request));
  }
});
