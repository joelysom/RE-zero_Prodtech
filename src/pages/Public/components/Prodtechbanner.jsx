import React from "react";
import styles from "../style/Prodtechbanner.module.css";

// Importar apenas a imagem que será usada
import background from "../../../assets/AProdTech/image/BG.png";

function Hero() {
  // Conteúdo estático
  const title = "ProdTech Services: Inovação e Eficiência em Suporte de TI";
  const subtitle = "Acreditamos que o suporte de TI deve ser uma solução, não um desafio. Com o uso de tecnologias avançadas garantimos um suporte ágil, eficiente e seguro para otimizar o desempenho do seu setor.";
  
  return (
    <section
      className={styles.prodtechbanner}
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
      <div className={styles.prodtechbannerContent}>
        <h1 className={styles.prodtitle}>
          {title}
        </h1>
        <p className={styles.prodsubtitle}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}

export default Hero;