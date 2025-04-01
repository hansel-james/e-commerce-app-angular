import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products/:id',
    renderMode: RenderMode.Server // ❌ No prerendering for product pages, use SSR instead
  },
  {
    path: 'profile/orders/:orderId',
    renderMode: RenderMode.Server // ❌ No prerendering for product pages, use SSR instead
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender // ✅ Prerender all other routes
  }
];
