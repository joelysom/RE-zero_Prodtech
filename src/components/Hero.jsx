// Hero.jsx
import { useState, useEffect, useRef } from "react";
import styles from "../styles/Hero.module.css";

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef(null);

  // Dados dos slides
  const slides = [
    {
      title: "Oferecemos soluções completas e eficientes em TI",
      subtitle: "Nossa expertise em TI abrange todas as áreas, garantindo soluções completas e eficientes para atender às suas necessidades.",
      btnText: "Fale conosco!",
      bgImage: "../assets/Home/image/fundo_home.png"
    },
    {
      title: "Suporte técnico especializado 24/7",
      subtitle: "Conte com nossa equipe de especialistas para resolver qualquer problema de TI, a qualquer hora do dia ou da noite.",
      btnText: "Saiba mais",
      bgImage: "../assets/Home/image/fundo_home2.png"
    },
    {
      title: "Soluções personalizadas para seu negócio",
      subtitle: "Desenvolvemos estratégias e implementações de TI que se adaptam perfeitamente às necessidades específicas da sua empresa.",
      btnText: "Ver serviços",
      bgImage: "../assets/Home/image/fundo_home3.png"
    }
  ];

  // Função para avançar para o próximo slide
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  // Função para voltar para o slide anterior
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Manipuladores de eventos para arrastar
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches ? e.touches[0].clientX : e.clientX);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = startX - currentX;
    setDragOffset(diff);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentX = e.clientX;
    const diff = startX - currentX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    // Determinar se o arrasto foi significativo para mudar de slide
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  // Desativar o autoplay para permitir uma melhor experiência de arrasto
  // Se quiser reativar, basta descomentar
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        setCurrentSlide(0);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);
  */

  // Calcular a transformação real para o arrasto
  const calculateTransform = () => {
    const baseTransform = -currentSlide * 100;
    // Adicionar o offset de arrasto convertido para porcentagem
    const dragPercentage = (dragOffset / (sliderRef.current?.offsetWidth || 1)) * 100;
    return `translateX(${baseTransform - dragPercentage}%)`;
  };

  return (
    <div className={styles.heroWrapper}>
      <div 
        className={styles.heroContainer} 
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div 
          className={styles.sliderTrack}
          style={{ 
            transform: calculateTransform(),
            transition: isDragging ? 'none' : 'transform 0.5s ease-out'
          }}
        >
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={styles.slide}
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            >
              <div className={styles.heroContent}>
                <h1 className={styles.title}>{slide.title}</h1>
                <p className={styles.subtitle}>{slide.subtitle}</p>
                <button className={styles.btnHero}>{slide.btnText}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.sliderDots}>
        {slides.map((_, index) => (
          <span 
            key={index} 
            className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero;