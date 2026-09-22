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

1. La app debe estar publicada en **HTTPS** (cualquier hosting gratuito: Netlify, Vercel o GitHub Pages).
2. Ábrela desde **Chrome en Android** (o **Safari en iPhone**).
3. Toca el menú (⋮ en Android / compartir en iPhone) y elige **"Instalar aplicación"** / **"Agregar a pantalla de inicio"**.
4. Listo: se abrirá en modo ventana propia (sin barra del navegador), con su ícono y fondo oscuro.

**Notas:**
* La app guarda la última respuesta de DolarAPI en caché: si te quedas sin internet, muestra las últimas tasas conocidas.
* El Service Worker solo se registra en el build de producción (`npm run build`), por eso no verás la PWA en `npm run dev`.

---

## 🚀 Cómo Ejecutar Localmente

Para correr este proyecto en tu computadora, asegúrate de tener instalado **Node.js**.

### 1. Clonar el repositorio
```bash
git clone [https://github.com/Josmarsanteliz/Cambio-de-moneda.git](https://github.com/Josmarsanteliz/Cambio-de-moneda.git)
cd Cambio-de-moneda