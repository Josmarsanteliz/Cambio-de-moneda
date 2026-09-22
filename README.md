# 🇻🇿 Cambio de Moneda | Tasas de Cambio Vzla

Aplicación web minimalista para consultar las tasas de cambio oficiales (BCV) y del mercado paralelo en Venezuela, obtenidas en tiempo real a través de **DolarAPI**.

---

## ✨ Características

* **📲 PWA Instalable:** Agrégala a la pantalla de inicio de tu celular y ábrela como una app nativa (funciona también sin conexión, mostrando las últimas tasas guardadas).
* **🚀 Marquesina en Vivo:** Barra superior con carrusel continuo de las tasas principales (Dólar BCV, Dólar Paralelo, Euro BCV, Euro Paralelo).
* **🧮 Calculadora Inteligente:** Convierte montos de Dólares/Euros a Bolívares Venezolanos (VES) y viceversa al instante de forma bidireccional.
* **🌌 Diseño Minimalista Oscuro:** Interfaz elegante y moderna en escala de grises con animación de estrellas fugaces de fondo (`Shooting Stars`).
* **📱 Responsive:** 100% adaptable a dispositivos móviles y de escritorio, con teclado numérico optimizado y soporte de safe-areas (notch).

---

## 🛠️ Tecnologías Utilizadas

### Frontend
* **React 19** con **TypeScript**
* **Vite** (para compilación ultra rápida)
* **Tailwind CSS** (para el diseño y estilos)
* **Axios** (para peticiones HTTP)
* **Service Worker** (para modo PWA/offline)

### Backend (Opcional / Referencia de Proxy)
* **Node.js** & **Express.js** (desarrollado inicialmente como proxy para el manejo de CORS)
* **TypeScript**

### Fuente de Datos
* [DolarAPI Venezuela](https://ve.dolarapi.com/)

---

## 📲 Cómo instalar la app en tu celular (PWA)

**URL en vivo:** 👉 **https://jdev-tasas-vzla.vercel.app**

1. La app debe estar publicada en **HTTPS** (ya desplegada en Vercel).
2. Ábrela desde **Chrome en Android** (o **Safari en iPhone**).
3. Toca el menú (⋮ en Android / compartir en iPhone) y elige **"Instalar aplicación"** / **"Agregar a pantalla de inicio"**.
4. Listo: se abrirá en modo ventana propia (sin barra del navegador), con su ícono y fondo oscuro.

**Notas:**
* La app guarda la última respuesta de DolarAPI en caché: si te quedas sin internet, muestra las últimas tasas conocidas.
* El Service Worker solo se registra en el build de producción (`npm run build`), por eso no verás la PWA en `npm run dev`.
* Para volver a desplegar tras un cambio: `cd frontend && npx vercel deploy --prod --yes`

---

## 📋 Cambios recientes

### 🗑️ Eliminación del preloader
* Se removió la pantalla de bienvenida con orbes giratorios (`ThinkingOrb`) y el timer de 3 segundos: la app ahora carga directo.
* Se eliminó la dependencia `thinking-orbs` de `frontend/package.json`.

### 📲 Migración a PWA (app instalable en el celular)
* Nuevo `frontend/public/manifest.webmanifest`: nombre, iconos (192/512/maskable), `display: standalone`, color de tema `#050505` y `start_url` en la raíz.
* Nuevo `frontend/public/sw.js` (Service Worker) que:
  * Precachea el shell de la app.
  * Guarda la última respuesta de DolarAPI → **si no hay internet muestra las últimas tasas conocidas**.
  * Usa *network-first* para la navegación y *stale-while-revalidate* para los assets.
* Registro del Service Worker en `frontend/src/main.tsx` (solo en producción).
* Nuevos íconos en `frontend/public/icons/` (192, 512 y maskable) + script regenerable `frontend/scripts/generate-icons.ps1` y `frontend/public/icon.svg`.
* `frontend/index.html`: manifest, `theme-color`, `apple-touch-icon`, `mobile-web-app-capable`, `viewport-fit=cover` y `lang="es"` (antes `en`).

### 📱 Optimizaciones para móvil
* **Teclado numérico** (`inputMode="decimal"`) en los dos inputs de la calculadora.
* Header reorganizado en dos filas para pantallas chicas (logo + EN VIVO / marquesina a ancho completo).
* Safe-areas (notch) en header y footer con `env(safe-area-inset-*)`.
* `min-h-dvh` en lugar de `min-h-screen` (la barra del navegador móvil cambia el alto del viewport).
* Paddings compactos (`px-4 sm:px-6`) y gaps reducidos en móvil.
* Estados de error visibles: *"Sin conexión — mostrando último guardado"* y *"No se pudieron cargar las tasas"* (antes quedaba en "Cargando…" infinito).
* Fondo `#050505` en `html/body` para evitar el destello blanco al abrir la PWA.
* `overscroll-behavior-y: none` y `-webkit-tap-highlight-color: transparent`.

### 🔧 Limpieza y correcciones
* Footer con HTML mal cerrado (div fuera de lugar) **reparado**.
* Eliminado código muerto de la plantilla Vite: `App.css`, `hero.png`, `react.svg`, `vite.svg` e `icons.svg`.

### 🚀 Despliegue (Vercel)
* Nuevo `frontend/vercel.json`: fallback SPA (`/(.*)` → `/`), `Cache-Control: max-age=0, must-revalidate` para `sw.js` y el manifest, y `Service-Worker-Allowed: /`.
* **App en vivo:** https://jdev-tasas-vzla.vercel.app
* Para volver a desplegar: `cd frontend && npx vercel deploy --prod --yes`

---

## 🚀 Cómo Ejecutar Localmente

Para correr este proyecto en tu computadora, asegúrate de tener instalado **Node.js**.

### 1. Clonar el repositorio
```bash
git clone [https://github.com/Josmarsanteliz/Cambio-de-moneda.git](https://github.com/Josmarsanteliz/Cambio-de-moneda.git)
cd Cambio-de-moneda