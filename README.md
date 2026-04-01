# VIAndalucía - Sitio Web

Sitio web de la Oficina de Vida Independiente Andalucía, migrado de WordPress a Astro 6.

## Stack

- **Astro 6** con Content Collections
- **TailwindCSS 4** para estilos
- **@astrojs/cloudflare** para despliegue en Cloudflare Pages/Workers
- **TypeScript**

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Despliegue en Cloudflare Pages

### Opción 1: Desde el dashboard de Cloudflare

1. Sube el repositorio a GitHub/GitLab
2. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/) > Workers & Pages > Create
3. Conecta tu repositorio
4. Configuración de build:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Variables de entorno (si usas envío de email):
   - `RESEND_API_KEY`: Tu clave de API de Resend

### Opción 2: Con Wrangler CLI

```bash
npx wrangler pages deploy dist/client
```

### Dominio personalizado

1. En Cloudflare Dashboard > tu proyecto > Custom domains
2. Añade `viandalucia.org`
3. Actualiza los DNS de tu dominio a los nameservers de Cloudflare

## Estructura del contenido

- `src/content/posts/` — 264 entradas de blog
- `src/content/pages/` — 107 páginas (incluye Convención ONU)
- `public/images/` — Imágenes estáticas

## Nota

El formulario de contacto (`/api/contact`) ejecuta como Cloudflare Worker.
Para habilitar el envío de emails, integra Resend u otro servicio en `src/pages/api/contact.ts`.
