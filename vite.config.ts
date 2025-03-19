import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tainwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/service-worker.ts', // 원본 파일 위치
          dest: '.' // 복사 위치 (public 디렉토리로 이동됨)
        }
      ]
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Currency Converter',
        short_name: 'Currency',
        description: 'Simple currency converter',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.exchangerate-api\.com\/v4\/latest\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'exchange-rate-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 하루 동안 캐싱
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    https: true // PWA는 https 환경에서 동작
  }
});