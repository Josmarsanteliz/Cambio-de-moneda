import  { useState, useEffect } from 'react';
import axios from 'axios';
import { ThinkingOrb } from 'thinking-orbs';


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
  
  // Estado para controlar el preloader de 3 segundos
  const [showSplash, setShowSplash] = useState<boolean>(true);

  useEffect(() => {
    // Timer de al menos 3 segundos para el preloader
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    // Consumo de la API
    axios.get('http://localhost:4000/api/rates')
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setRates(response.data.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener tasas:', error);
        setLoading(false);
      });

    return () => clearTimeout(timer);
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

  // Pantalla de Preloader (SplashScreen)
  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <ThinkingOrb state="solving" size={64} speed={0.60} />
          <span className="text-xs tracking-widest uppercase text-neutral-400 font-mono animate-pulse">
            tasas de cambio // CARGANDO...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans antialiased relative overflow-hidden selection:bg-white selection:text-black flex flex-col justify-between">
      
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
        <header className="border-b border-neutral-800 bg-black/60 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center gap-4">
            
            <div className="flex items-center space-x-3 shrink-0">
              <span className="bg-white text-black font-black px-2.5 py-1 text-xs tracking-wider rounded shadow-sm">
                Jdev
              </span>
              <span className="text-xs text-neutral-400 tracking-widest uppercase font-medium hidden md:inline">
                | TASAS DE CAMBIO VZLA
              </span>
            </div>

            {/* Carrusel de Tasas en el Header */}
            <div className="overflow-hidden relative w-full max-w-md flex items-center bg-neutral-900/80 px-4 py-1.5 rounded-lg border border-neutral-800">
              <div className="flex space-x-8 animate-marquee whitespace-nowrap text-xs">
                {loading || rates.length === 0 ? (
                  <span className="text-neutral-500">Cargando tasas en vivo...</span>
                ) : (
                  [...rates, ...rates].map((rate, idx) => (
                    <div key={idx} className="flex items-center space-x-2 cursor-pointer" onClick={() => setSelectedIndex(idx % rates.length)}>
                      <span className="text-neutral-400 font-medium uppercase">{rate.nombre}:</span>
                      <span className="text-white font-mono font-bold">
                        Bs. {rate.promedio ? rate.promedio.toFixed(2) : rate.venta?.toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Estado Online */}
            <div className="text-xs text-neutral-400 hidden lg:flex items-center space-x-2 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800 shrink-0">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="font-semibold text-neutral-300">EN VIVO</span>
            </div>
          </div>
        </header>

        {/* Main Container */}
        <main className="max-w-5xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white tracking-wide uppercase">Tasas de cambio</h1>
            <p className="text-xs text-neutral-400 mt-1">Calculadora de divisas con diseño minimalista en escala de grises.</p>
          </div>

          {/* Tarjeta Principal de Conversión Bidireccional */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 relative backdrop-blur-sm">
            
            {/* Input Divisas */}
            <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 flex flex-col justify-between">
              <span className="text-xs text-neutral-400 font-semibold tracking-wider mb-2 uppercase">
                MONTO ({currentRate?.moneda || 'USD'})
              </span>
              <div className="flex justify-between items-center">
                <input 
                  type="text" 
                  value={direction === 'FOREIGN_TO_VES' ? amount : calculatedForeign ? calculatedForeign.toFixed(2) : ''} 
                  onChange={(e) => {
                    setDirection('FOREIGN_TO_VES');
                    setAmount(e.target.value);
                  }}
                  className="bg-transparent text-3xl md:text-4xl font-extrabold text-white focus:outline-none w-full font-mono"
                />
                <span className="bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-inner shrink-0">
                  {currentRate?.moneda === 'EUR' ? '🇪🇺 EUR' : '🇺🇸 USD'}
                </span>
              </div>
            </div>

            {/* Input VES */}
            <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-neutral-400 font-semibold tracking-wider uppercase">MONTO (VES)</span>
                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-mono uppercase font-bold border border-white/20">
                  {currentRate?.nombre || 'General'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <input 
                  type="text" 
                  value={direction === 'VES_TO_FOREIGN' ? amount : calculatedVES ? calculatedVES.toFixed(2) : ''} 
                  onChange={(e) => {
                    setDirection('VES_TO_FOREIGN');
                    setAmount(e.target.value);
                  }}
                  className="bg-transparent text-3xl md:text-4xl font-extrabold text-white focus:outline-none w-full font-mono"
                />
                <span className="bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-inner shrink-0">
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
                    ? 'bg-white text-black border-white shadow-white/5' 
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {rate.nombre.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tarjetas Informativas Detalladas */}
          <div className="mt-8">
            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Mercado Actual</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {loading ? (
                <div className="col-span-4 text-center py-10 text-neutral-500 font-medium">Sincronizando endpoints...</div>
              ) : (
                rates.map((rate, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedIndex(index)}
                    className={`bg-neutral-900/90 border p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] ${
                      selectedIndex === index 
                        ? 'border-white/60 shadow-xl shadow-neutral-900 bg-gradient-to-b from-neutral-900 to-neutral-950' 
                        : 'border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{rate.nombre}</h3>
                      <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded-full uppercase font-mono">
                        {rate.moneda}
                      </span>
                    </div>
                    <p className="text-2xl font-black text-white mt-4 font-mono tracking-tight">
                      Bs. {rate.promedio ? rate.promedio.toFixed(2) : rate.venta?.toFixed(2)}
                    </p>
                    <div className="mt-4 pt-3 border-t border-neutral-800/60 flex justify-between items-center text-[11px] text-neutral-500">
                      <span>Fuente</span>
                      <span className="text-neutral-300 font-mono font-medium uppercase">
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
      <footer className="relative z-10 border-t border-neutral-800/80 bg-black/40 backdrop-blur-md py-6 mt-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400 tracking-wider">
            © {new Date().getFullYear()} Todos los derechos reservados <span className="text-white font-semibold">Jdev</span>
          </p>
          
      </div>
      </footer>

    </div>
  );
}