import styles from "../style/SocialMedia.module.css";
import instagram from "../../../assets/Home/image/Instagramprodtec.jpg";

function SocialMedia() {
  return (
    <section className={styles.instagram}>
      <div className={styles.socialContainer}>
        <img src={instagram} alt="Instagram" className={styles.instagramImage} />
        <div className={styles.textContent}>
          <h3>
            <strong>
              Confira as últimas novidades da em nossas redes sociais!
            </strong>
          </h3>
          <p>
            No Instagram da ProdTech, você encontra dicas, novidades e os
            melhores conteúdos sobre tecnologia!
          </p>
        </div>
      </div>
    </section>
  );
}

export default SocialMedia;
