// VQ SIGNAL Service Worker v1.0
const CACHE_NAME = 'vq-signal-v1';

// インストール
self.addEventListener('install', e => {
  self.skipWaiting();
});

// アクティベート
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// プッシュ通知受信（将来のサーバープッシュ用）
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'VQ SIGNAL', {
      body: data.body || 'シグナルが検出されました',
      icon: data.icon || '/vq-ratio/icon.svg',
      badge: '/vq-ratio/icon.svg',
      tag: 'vq-signal',
      requireInteraction: data.urgent || false,
      data: { url: '/vq-ratio/' }
    })
  );
});

// 通知クリック → アプリを開く
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const client of list) {
        if (client.url.includes('/vq-ratio/') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/vq-ratio/');
    })
  );
});

// バックグラウンドでの定期チェック（将来拡張用）
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SIGNAL') {
    const d = e.data;
    self.registration.showNotification(d.title, {
      body: d.body,
      tag: 'vq-signal',
      requireInteraction: d.urgent,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23060A0E"/><text y="80" x="10" font-size="80">⚡</text></svg>'
    });
  }
});
