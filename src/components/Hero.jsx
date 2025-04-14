import styles from "../styles/Hero.module.css";

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          Oferecemos soluções completas e eficientes em TI
        </h1>
        <p className={styles.subtitle}>
          Nossa expertise em TI abrange todas as áreas, garantindo soluções
          completas e eficientes para atender às suas necessidades.
        </p>
        <button className={styles.btnHero}>Fale conosco!</button>
      </div>
    </section>
  );
}

export default Hero;