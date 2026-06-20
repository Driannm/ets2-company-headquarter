import { session, app } from 'electron';

export function configureSecurityPolicies() {
  const isDev = !app.isPackaged || process.argv.includes('--dev') || process.env.NODE_ENV === 'development';

  session.defaultSession.webRequest.onHeadersReceived(
    { urls: ['*://*/*', 'file://*'] }, // Menangkap semua koneksi jaringan lokal & eksternal
    (details, callback) => {
      const responseHeaders = { ...details.responseHeaders };

      // Hapus header CSP bawaan secara case-insensitive
      Object.keys(responseHeaders).forEach((key) => {
        if (key.toLowerCase() === 'content-security-policy') {
          delete responseHeaders[key];
        }
      });

      if (isDev) {
        // Mode Pengembangan: Melonggarkan batasan agar Vite Dev Server & HMR berjalan mulus
        responseHeaders['Content-Security-Policy'] = [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173 ws://localhost:5173; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173 blob:; " +
          "style-src 'self' 'unsafe-inline' http://localhost:5173; " +
          "connect-src 'self' ws://localhost:5173 http://localhost:5173 ws://127.0.0.1:45612 http://127.0.0.1:45612; " +
          "img-src 'self' data: blob: http://localhost:5173;"
        ];
      } else {
        // Mode Produksi: Terapkan kebijakan restriktif demi keamanan
        responseHeaders['Content-Security-Policy'] = [
          "default-src 'self'; " +
          "script-src 'self'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "connect-src 'self' ws://127.0.0.1:45612 http://127.0.0.1:45612; " +
          "img-src 'self' data: blob;"
        ];
      }

      callback({ responseHeaders });
    }
  );

  app.on('web-contents-created', (_, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      if (
        parsedUrl.origin !== 'http://localhost:5173' &&
        parsedUrl.protocol !== 'file:'
      ) {
        event.preventDefault();
      }
    });

    contents.setWindowOpenHandler(() => ({ action: 'deny' }));
  });
}