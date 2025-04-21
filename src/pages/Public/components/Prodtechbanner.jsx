import { useState, useEffect } from "react";
import styles from "../style/Prodtechbanner.module.css";

// Importar imagens diretamente
// Substitua estes imports pelos caminhos corretos para suas imagens
import background1 from "../../../assets/Home/image/fundo_home.png";
import background2 from "../../../assets/Contatos/img/Tela-de-fundo.png";
import background3 from "../../../assets/AProdTech/image/Protótipo - A Prodtech 1.png";

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
 
  // Use as imagens importadas
  const backgrounds = [
    background1,
    background2,
    background3
  ];
 
  const titles = [
    "ProdTech Services: Inovação e Eficiência em Suporte de TI",
    "Atendimento Personalizado para Cada Cliente",
    "Soluções Tecnológicas para o Futuro"
  ];
 
  const subtitles = [
    "Acreditamos que o suporte de TI deve ser uma solução, não um desafio. Com o uso de tecnologias avançadas garantimos um suporte ágil, eficiente e seguro para otimizar o desempenho do seu setor.",
    "Nossa equipe qualificada está pronta para atender suas necessidades específicas com rapidez e profissionalismo.",
    "Estamos sempre à frente, implementando as mais recentes inovações para garantir o melhor serviço para sua empresa."
  ];
 
  useEffect(() => {
    // Configura o intervalo para alternar entre os slides
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % backgrounds.length);
    }, 6000);
   
    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, [backgrounds.length]);
 
  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };
 
  return (
    <section
      className={styles.prodtechbanner}
      style={{
        backgroundImage: `url(${backgrounds[currentSlide]})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
      <div className={styles.prodtechbannerContent}>
        <h1 className={styles.prodtitle}>
          {titles[currentSlide]}
        </h1>
        <p className={styles.prodsubtitle}>
          {subtitles[currentSlide]}
        </p>
      </div>
     
      <div className={styles.carouselControls}>
        {backgrounds.map((_, index) => (
          <div
            key={index}
            className={`${styles.carouselDot} ${currentSlide === index ? styles.activeDot : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;