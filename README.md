# 🇻🇿 Cambio de Moneda | Tasas de Cambio Vzla

Aplicación web minimalista para consultar las tasas de cambio oficiales (BCV) y del mercado paralelo en Venezuela, obtenidas en tiempo real a través de **DolarAPI**.

---

## ✨ Características

* **⚡ Preloader:** Animación de bienvenida con orbes giratorios al cargar la app.
* **🚀 Marquesina en Vivo:** Barra superior con carrusel continuo de las tasas principales (Dólar BCV, Dólar Paralelo, Euro BCV, Euro Paralelo).
* **🧮 Calculadora Inteligente:** Convierte montos de Dólares/Euros a Bolívares Venezolanos (VES) y viceversa al instante de forma bidireccional.
* **🌌 Diseño Minimalista Oscuro:** Interfaz elegante y moderna en escala de grises con animación de estrellas fugaces de fondo (`Shooting Stars`).
* **📱 Responsive:** 100% adaptable a dispositivos móviles y de escritorio.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
* **React 19** con **TypeScript**
* **Vite** (para compilación ultra rápida)
* **Tailwind CSS** (para el diseño y estilos)
* **Axios** (para peticiones HTTP)
* **thinking-orbs** (para la animación del preloader)

### Backend (Opcional / Referencia de Proxy)
* **Node.js** & **Express.js** (desarrollado inicialmente como proxy para el manejo de CORS)
* **TypeScript**

### Fuente de Datos
* [DolarAPI Venezuela](https://ve.dolarapi.com/)

---

## 🚀 Cómo Ejecutar Localmente

Para correr este proyecto en tu computadora, asegúrate de tener instalado **Node.js**.

### 1. Clonar el repositorio
```bash
git clone [https://github.com/Josmarsanteliz/Cambio-de-moneda.git](https://github.com/Josmarsanteliz/Cambio-de-moneda.git)
cd Cambio-de-moneda