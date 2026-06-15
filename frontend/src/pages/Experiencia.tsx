import { useState, useEffect, useRef, useId } from 'react';
import type { MouseEvent } from 'react';
import imgExperiencia from '../assets/coca_cola_experiencia.png';
import imgFamilia from '../assets/coca_cola_familia.png';
import imgPaises from '../assets/coca_cola_paises.png';
import imgHistoria from '../assets/coca_cola_historia.png';

// --- SILUETAS SVG ESTÁTICAS ---
const BottleSilhouette = ({ fill }: { fill: string }) => (
  <svg width="20" height="60" viewBox="0 0 20 60" fill={fill} xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0C13 0 14 2 14 6C14 16 19 22 19 40C19 56 16 58 14 59C12 60 10 60 10 60C10 60 8 60 6 59C4 58 1 56 1 40C1 22 6 16 6 6C6 2 7 0 10 0Z" />
  </svg>
);

const CanSilhouette = ({ fill }: { fill: string }) => (
  <svg width="24" height="40" viewBox="0 0 24 40" fill={fill} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="36" rx="3" />
    <path d="M2 6L22 6M2 34L22 34" stroke={fill === '#FFF' ? '#000' : '#FFF'} strokeWidth="1" opacity="0.3"/>
  </svg>
);

const CapSilhouette = ({ fill }: { fill: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12C2 12 12 8 22 12" stroke={fill === '#FFF' ? '#000' : '#FFF'} strokeWidth="1" fill="none" opacity="0.3"/>
  </svg>
);

const SectionBackground = ({ patternFill, opacity }: { patternFill: string, opacity: number }) => {
  const patternId = useId();
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity }}>
      <svg className="w-full h-full">
        <defs>
          <pattern id={patternId} x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
            <g transform="translate(20, 20) rotate(15) scale(1.5)"><BottleSilhouette fill={patternFill} /></g>
            <g transform="translate(100, 50) rotate(-15) scale(1.5)"><CanSilhouette fill={patternFill} /></g>
            <g transform="translate(50, 120) rotate(45) scale(1.5)"><CapSilhouette fill={patternFill} /></g>
            <g transform="translate(140, 140) rotate(-30) scale(1.2)"><BottleSilhouette fill={patternFill} /></g>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};

// --- EFECTO JS: LÍNEAS DE NEÓN ---
const NeonCanvas = ({ mousePos, scrollY }: { mousePos: {x: number, y: number}, scrollY: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const lines = [
        { baseOffset: 0.2, color: '#F40009', width: 4, blur: 20, mouseFactor: -2, speed: 0.005 },
        { baseOffset: 0.5, color: '#FFFFFF', width: 2, blur: 15, mouseFactor: 5, speed: 0.008 },
        { baseOffset: 0.8, color: '#111111', width: 6, blur: 10, mouseFactor: -1, speed: 0.003, shadow: '#F40009' },
      ];

      const time = Date.now() * 0.001;

      lines.forEach(line => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.shadowColor = line.shadow || line.color;
        ctx.shadowBlur = line.blur;

        for (let y = 0; y < canvas.height; y += 20) {
          const wave = Math.sin(y * 0.005 + time + scrollY * line.speed) * 30;
          const targetX = canvas.width * line.baseOffset + mousePos.x * line.mouseFactor;
          const currentX = targetX + wave;
          
          if (y === 0) ctx.moveTo(currentX, y);
          else ctx.lineTo(currentX, y);
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos, scrollY]);

  // z-10 sits on top of section backgrounds (z-0) but behind section content (z-20)
  return <canvas ref={canvasRef} className="fixed inset-0 z-10 pointer-events-none opacity-80" />;
};

export default function Experiencia() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Track mouse and scroll for JS effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 50,
      y: (e.clientY / window.innerHeight - 0.5) * 50,
    });
  };

  const sectionsData = {
    familia: {
      id: 'familia',
      title: 'La Familia Coca-Cola',
      desc: 'Desde 1886, hemos estado en la mesa de millones de familias. Compartiendo risas, momentos y el sabor original.',
      img: imgFamilia,
      textColor: 'text-white',
      btnStyle: 'bg-white text-coca-red hover:bg-gray-200',
      modalContent: 'Coca-Cola es sinónimo de unión. Nuestra publicidad a través de las décadas siempre ha reflejado los valores de estar juntos. La comida sabe mejor con Coca-Cola.'
    },
    paises: {
      id: 'paises',
      title: 'Un Sabor Global',
      desc: 'No importa el idioma, la cultura o la distancia. Una Coca-Cola fría significa felicidad en cualquier parte del mundo.',
      img: imgPaises,
      textColor: 'text-coca-black',
      btnStyle: 'bg-coca-red text-white hover:bg-red-700',
      modalContent: 'Con presencia en más de 200 países, Coca-Cola es verdaderamente global. Un solo sabor que rompe fronteras y celebra la diversidad.'
    },
    historia: {
      id: 'historia',
      title: 'Nuestra Historia',
      desc: 'De una pequeña farmacia en Atlanta a ser la bebida más icónica del planeta. Conoce el legado.',
      img: imgHistoria,
      textColor: 'text-white',
      btnStyle: 'bg-coca-red text-white hover:bg-red-700',
      modalContent: 'El farmacéutico John S. Pemberton inventó la fórmula de Coca-Cola en 1886. Lo que comenzó como un tónico se convirtió en una leyenda.'
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-black" onMouseMove={handleMouseMove}>
      
      {/* Capa de Efectos JS (Líneas Neón) Global */}
      <NeonCanvas mousePos={mousePos} scrollY={scrollY} />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 bg-coca-black overflow-hidden">
        {/* Background Pattern */}
        <SectionBackground patternFill="#F40009" opacity={0.15} />
        
        <div className="relative z-20 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col justify-center">
            <h1 className="text-6xl md:text-8xl font-black mb-6 text-white tracking-tighter leading-tight drop-shadow-2xl">
              VIVE LA <br /> <span className="text-coca-red bg-none" style={{ textShadow: '0 0 40px rgba(244,0,9,1)' }}>EXPERIENCIA</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-10 font-light leading-relaxed max-w-lg">
              Siente el sonido inconfundible de una botella abriéndose, las burbujas saltando y el hielo crujiendo.
            </p>
          </div>
          <div 
            className="relative w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(244,0,9,0.8)] border border-white/20 transition-transform duration-200 ease-out"
            style={{ transform: `perspective(1000px) rotateX(${mousePos.y * -0.5}deg) rotateY(${mousePos.x * 0.5}deg)` }}
          >
            <img src={imgExperiencia} alt="Experiencia Coca-Cola" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* --- SECCIÓN FAMILIA (Degradado a Rojo) --- */}
      <section className="relative min-h-screen flex items-center py-24 px-4 bg-gradient-to-b from-coca-black to-coca-red overflow-hidden">
        <SectionBackground patternFill="#FFFFFF" opacity={0.1} />
        
        <div className="relative z-20 max-w-7xl mx-auto w-full flex flex-col md:flex-row-reverse gap-12 items-center">
          <div 
            className="w-full md:w-1/2 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 transition-transform duration-700 ease-out hover:scale-105"
            onClick={() => setActiveModal(sectionsData.familia.id)}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img src={sectionsData.familia.img} alt={sectionsData.familia.title} className="w-full h-[450px] object-cover" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
              <div className="bg-black/80 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold tracking-widest border border-white/30 hover:scale-110 transition-transform">
                VER DETALLES
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className={`text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight ${sectionsData.familia.textColor}`}>
              {sectionsData.familia.title}
            </h2>
            <p className={`text-xl mb-10 leading-relaxed font-medium text-white`}>
              {sectionsData.familia.desc}
            </p>
            <button 
              onClick={() => setActiveModal(sectionsData.familia.id)}
              className={`${sectionsData.familia.btnStyle} px-10 py-4 rounded-full font-bold transition-all w-max uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1`}
            >
              Explorar
            </button>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN PAÍSES (Degradado a Blanco) --- */}
      <section className="relative min-h-screen flex items-center py-24 px-4 bg-gradient-to-b from-coca-red to-white overflow-hidden">
        <SectionBackground patternFill="#F40009" opacity={0.15} />
        
        <div className="relative z-20 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-12 items-center">
          <div 
            className="w-full md:w-1/2 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-[0_20px_60px_-15px_rgba(244,0,9,0.3)] border border-red-500/20 transition-transform duration-700 ease-out hover:scale-105"
            onClick={() => setActiveModal(sectionsData.paises.id)}
          >
            <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img src={sectionsData.paises.img} alt={sectionsData.paises.title} className="w-full h-[450px] object-cover" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
              <div className="bg-coca-red/90 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold tracking-widest border border-red-500/30 hover:scale-110 transition-transform">
                VER DETALLES
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className={`text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight ${sectionsData.paises.textColor}`}>
              {sectionsData.paises.title}
            </h2>
            <p className={`text-xl mb-10 leading-relaxed font-bold text-gray-800`}>
              {sectionsData.paises.desc}
            </p>
            <button 
              onClick={() => setActiveModal(sectionsData.paises.id)}
              className={`${sectionsData.paises.btnStyle} px-10 py-4 rounded-full font-bold transition-all w-max uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1`}
            >
              Explorar
            </button>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN HISTORIA (Degradado a Negro) --- */}
      <section className="relative min-h-screen flex items-center py-24 px-4 bg-gradient-to-b from-white to-coca-black overflow-hidden">
        <SectionBackground patternFill="#111111" opacity={0.2} />
        
        <div className="relative z-20 max-w-7xl mx-auto w-full flex flex-col md:flex-row-reverse gap-12 items-center">
          <div 
            className="w-full md:w-1/2 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-gray-500/20 transition-transform duration-700 ease-out hover:scale-105"
            onClick={() => setActiveModal(sectionsData.historia.id)}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img src={sectionsData.historia.img} alt={sectionsData.historia.title} className="w-full h-[450px] object-cover" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
              <div className="bg-black/80 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold tracking-widest border border-white/30 hover:scale-110 transition-transform">
                VER DETALLES
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            {/* Como va hacia negro, el título de Historia es blanco, con buena sombra para el contraste con la parte superior blanca */}
            <h2 className={`text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
              {sectionsData.historia.title}
            </h2>
            <p className={`text-xl mb-10 leading-relaxed font-bold text-gray-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}>
              {sectionsData.historia.desc}
            </p>
            <button 
              onClick={() => setActiveModal(sectionsData.historia.id)}
              className={`${sectionsData.historia.btnStyle} px-10 py-4 rounded-full font-bold transition-all w-max uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1`}
            >
              Explorar
            </button>
          </div>
        </div>
      </section>

      {/* Modal Interactivo */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-300" onClick={() => setActiveModal(null)}></div>
          <div className="relative bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 rounded-3xl max-w-2xl w-full p-10 md:p-14 shadow-[0_0_150px_rgba(244,0,9,0.3)] z-10 overflow-hidden animate-fade-in-up">
            
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-coca-red p-3 rounded-full z-20"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {Object.values(sectionsData).filter(s => s.id === activeModal).map(section => (
              <div key={section.id} className="relative z-10">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-coca-red/30 blur-[80px] rounded-full pointer-events-none"></div>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">{section.title}</h3>
                <div className="w-20 h-2 bg-coca-red mb-8 rounded-full"></div>
                <p className="text-xl text-gray-300 leading-relaxed font-light mb-12">
                  {section.modalContent}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-coca-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 hover:shadow-[0_0_30px_rgba(244,0,9,0.5)] transition-all">
                    Compartir
                  </button>
                  <button onClick={() => setActiveModal(null)} className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-colors">
                    Volver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
}
