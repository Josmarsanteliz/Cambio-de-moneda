import  { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from './Logo';


interface ExchangeRate {
  moneda: string;
  fuente: string;
  nombre: string;
  compra: number;
  venta: number;
  promedio: number;
  fechaActualizacion: string;
}

export default function App() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [amount, setAmount] = useState<string>('100');
  const [direction, setDirection] = useState<'FOREIGN_TO_VES' | 'VES_TO_FOREIGN'>('FOREIGN_TO_VES');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

useEffect(() => {
    // Consumo directo de DolarAPI desde el frontend
    Promise.all([
      axios.get('https://ve.dolarapi.com/v1/dolares/oficial').catch(() => null),
      axios.get('https://ve.dolarapi.com/v1/dolares/paralelo').catch(() => null),
      axios.get('https://ve.dolarapi.com/v1/euros/oficial').catch(() => null),
      axios.get('https://ve.dolarapi.com/v1/euros/paralelo').catch(() => null),
    ])
      .then(([dolarOficial, dolarParalelo, euroOficial, euroParalelo]) => {
        const fetchedRates = [
          dolarOficial?.data,
          dolarParalelo?.data,
          euroOficial?.data,
          euroParalelo?.data,
        ].filter(Boolean);

        setRates(fetchedRates);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener tasas:', error);
        setLoading(false);
      });
  }, []);

  const currentRate = rates[selectedIndex] || rates[0];
  const rateValue = currentRate ? (currentRate.promedio || currentRate.venta || 0) : 0;
  const numericAmount = parseFloat(amount) || 0;

  // Cálculos dinámicos según la dirección
  const calculatedVES = direction === 'FOREIGN_TO_VES' 
    ? numericAmount * rateValue 
    : numericAmount;

  const calculatedForeign = direction === 'VES_TO_FOREIGN' 
    ? (rateValue > 0 ? numericAmount / rateValue : 0) 
    : numericAmount;

  const stars = Array.from({ length: 15 });

  // Sin datos y sin carga en curso -> sin conexión / error de API
  const noRates = !loading && rates.length === 0;

  return (
    <div className="min-h-dvh bg-floral text-carbon font-sans antialiased relative overflow-hidden flex flex-col justify-between">
      
      {/* Fondo de Estrellas Fugaces (Shooting Stars) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {stars.map((_, i) => {
          const randomLeft = Math.random() * 100;
          const randomDuration = 3 + Math.random() * 5;
          const randomDelay = Math.random() * 5;
          const randomScale = 0.5 + Math.random() * 1;

          return (
            <span
              key={i}
              className="shooting-star"
              style={{
                left: `${randomLeft}%`,
                top: `-50px`,
                animationDuration: `${randomDuration}s`,
                animationDelay: `${randomDelay}s`,
                transform: `scale(${randomScale})`,
              }}
            />
          );
        })}
      </div>

      {/* Contenido Principal */}
      <div className="relative z-10 flex-1">
        
        {/* Header Minimalista Monocromático */}
        <header className="border-b border-silver/70 bg-floral/85 backdrop-blur-md sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">

            {/* Fila 1: Logo + estado en vivo (móvil/tablet) */}
            <div className="flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center space-x-3 min-w-0">
                <Logo className="h-8 w-8 shrink-0" />
                <span className="text-sm font-bold text-carbon tracking-wide whitespace-nowrap">
                  Jdev<span className="text-paprika">.</span>
                </span>
                <span className="text-xs text-charcoal/60 tracking-widest uppercase font-medium hidden sm:inline">
                  | TASAS DE CAMBIO VZLA
                </span>
              </div>

              <div className="flex lg:hidden items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-silver/70 shrink-0">
                <span className="w-2 h-2 rounded-full bg-paprika animate-pulse"></span>
                <span className="text-xs font-semibold text-charcoal">EN VIVO</span>
              </div>
            </div>

            {/* Fila 2: Carrusel de Tasas en el Header */}
            <div className="overflow-hidden relative w-full sm:max-w-md flex items-center bg-white/80 px-4 py-1.5 rounded-lg border border-silver/70">
              <div className="flex space-x-8 animate-marquee whitespace-nowrap text-xs">
                {loading ? (
                  <span className="text-charcoal/60">Cargando tasas en vivo...</span>
                ) : noRates ? (
                  <span className="text-charcoal/60">Sin conexión — mostrando último guardado</span>
                ) : (
                  [...rates, ...rates].map((rate, idx) => (
                    <div key={idx} className="flex items-center space-x-2 cursor-pointer" onClick={() => setSelectedIndex(idx % rates.length)}>
                      <span className="text-charcoal/70 font-medium uppercase">{rate.nombre}:</span>
                      <span className="text-paprika-deep font-mono font-bold">
                        Bs. {rate.promedio ? rate.promedio.toFixed(2) : rate.venta?.toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Estado Online (desktop) */}
            <div className="text-xs text-charcoal/70 hidden lg:flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-silver/70 shrink-0">
              <span className="w-2 h-2 rounded-full bg-paprika animate-pulse"></span>
              <span className="font-semibold text-charcoal">EN VIVO</span>
            </div>
          </div>
        </header>

        {/* Main Container */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="mb-8 flex items-center gap-4">
            <Logo className="h-12 w-12 shrink-0" />
            <div>
              <h1 className="text-xl font-bold text-carbon tracking-wide uppercase">Tasas de cambio</h1>
              <p className="text-xs text-charcoal/75 mt-1">Calculadora de divisas con diseño minimalista y paleta Josmar.</p>
            </div>
          </div>

          {/* Tarjeta Principal de Conversión Bidireccional */}
          <div className="bg-white border border-silver rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl shadow-carbon/10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative backdrop-blur-sm">
            
            {/* Input Divisas */}
            <div className="bg-floral p-5 rounded-xl border border-silver/70 flex flex-col justify-between">
              <span className="text-xs text-charcoal/70 font-semibold tracking-wider mb-2 uppercase">
                MONTO ({currentRate?.moneda || 'USD'})
              </span>
              <div className="flex justify-between items-center">
                <input 
                  type="text" 
                  inputMode="decimal"
                  autoComplete="off"
                  enterKeyHint="done"
                  value={direction === 'FOREIGN_TO_VES' ? amount : calculatedForeign ? calculatedForeign.toFixed(2) : ''} 
                  onChange={(e) => {
                    setDirection('FOREIGN_TO_VES');
                    setAmount(e.target.value);
                  }}
                  className="bg-transparent text-3xl md:text-4xl font-extrabold text-carbon focus:outline-none w-full font-mono"
                />
                <span className="bg-carbon border border-carbon px-3 py-1.5 rounded-lg text-xs font-bold text-floral shadow-inner shrink-0">
                  {currentRate?.moneda === 'EUR' ? '🇪🇺 EUR' : '🇺🇸 USD'}
                </span>
              </div>
            </div>

            {/* Input VES */}
            <div className="bg-floral p-5 rounded-xl border border-silver/70 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-charcoal/70 font-semibold tracking-wider uppercase">MONTO (VES)</span>
                <span className="text-[10px] bg-paprika/10 text-paprika-deep px-2 py-0.5 rounded font-mono uppercase font-bold border border-paprika/40">
                  {currentRate?.nombre || 'General'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <input 
                  type="text" 
                  inputMode="decimal"
                  autoComplete="off"
                  enterKeyHint="done"
                  value={direction === 'VES_TO_FOREIGN' ? amount : calculatedVES ? calculatedVES.toFixed(2) : ''} 
                  onChange={(e) => {
                    setDirection('VES_TO_FOREIGN');
                    setAmount(e.target.value);
                  }}
                  className="bg-transparent text-3xl md:text-4xl font-extrabold text-carbon focus:outline-none w-full font-mono"
                />
                <span className="bg-carbon border border-carbon px-3 py-1.5 rounded-lg text-xs font-bold text-floral shadow-inner shrink-0">
                  🇻🇪 VES
                </span>
              </div>
            </div>
          </div>

          {/* Botones de Selección Rápida */}
          <div className="mt-6 flex gap-2.5 overflow-x-auto pb-2">
            {rates.map((rate, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all border shadow-sm ${
                  selectedIndex === idx 
                    ? 'bg-paprika text-carbon border-paprika shadow-paprika/25' 
                    : 'bg-white text-charcoal/70 border-silver hover:border-carbon hover:text-carbon'
                }`}
              >
                {rate.nombre.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tarjetas Informativas Detalladas */}
          <div className="mt-8">
            <h2 className="text-sm font-bold text-paprika-deep uppercase tracking-wider mb-4">Mercado Actual</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {loading ? (
                <div className="sm:col-span-2 md:col-span-4 text-center py-10 text-charcoal/60 font-medium">Sincronizando endpoints...</div>
              ) : noRates ? (
                <div className="sm:col-span-2 md:col-span-4 text-center py-10 text-charcoal/60 font-medium">
                  No se pudieron cargar las tasas. Revisa tu conexión a internet.
                </div>
              ) : (
                rates.map((rate, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedIndex(index)}
                    className={`bg-white border p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] ${
                      selectedIndex === index 
                        ? 'border-paprika shadow-xl shadow-paprika/20 bg-white' 
                        : 'border-silver/70 hover:border-paprika/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-bold text-charcoal/70 uppercase tracking-wider">{rate.nombre}</h3>
                      <span className="text-[10px] bg-carbon text-floral px-2.5 py-0.5 rounded-full uppercase font-mono">
                        {rate.moneda}
                      </span>
                    </div>
                    <p className="text-2xl font-black text-carbon mt-4 font-mono tracking-tight">
                      Bs. {rate.promedio ? rate.promedio.toFixed(2) : rate.venta?.toFixed(2)}
                    </p>
                    <div className="mt-4 pt-3 border-t border-silver/60 flex justify-between items-center text-[11px] text-charcoal/60">
                      <span>Fuente</span>
                      <span className="text-charcoal font-mono font-medium uppercase">
                        {rate.fuente}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </main>
      </div>

      {/* Footer Minimalista */}
      <footer className="relative z-10 border-t border-silver/70 bg-floral/85 backdrop-blur-md pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-charcoal/70 tracking-wider text-center sm:text-left flex items-center gap-2">
            <Logo className="h-7 w-7" />
            © {new Date().getFullYear()} Todos los derechos reservados <span className="text-carbon font-semibold">Jdev</span>
          </p>
        </div>
      </footer>

    </div>
  );
}