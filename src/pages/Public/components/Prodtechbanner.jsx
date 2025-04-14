import styles from "../style/Prodtechbanner.module.css";

function Hero() {
  return (
    <section className={styles.prodtechbanner}>
      <div className={styles.prodtechbannerContent}>
        <h1 className={styles.prodtitle}>
          ProdTech Services: Inovação e Eficiência em Suporte de TI
        </h1>
        <p className={styles.prodsubtitle}>
          Acreditamos que o suporte de TI deve ser uma solução, não um desafio.
          Com o uso de tecnologias avançadas garantimos um suporte ágil,
          eficiente e seguro para otimizar o desempenho do seu setor
        </p>
      </div>
    </section>
  );
}

export default Hero;
