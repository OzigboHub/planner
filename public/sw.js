const CACHE_NAME = "pa-festus-memorial-v1";

const PRECACHE_URLS = [
  "/",
  "/about",
  "/programme",
  "/order-of-mass",
  "/tributes",
  "/support",
  "/portal",
  "/manifest.json",
  "/crest.jpg",
  "/pa_festus_portrait.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn("PWA precache error:", err);
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Ignore cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Stale-while-revalidate or Network-first for pages and assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is HTML navigation, fallback to cached root or order of mass
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match(event.request) || caches.match("/");
          }
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
