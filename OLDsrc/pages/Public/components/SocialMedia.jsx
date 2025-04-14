import "../style/socialmedia.css";
import instagram from "../../../assets/Home/image/Instagramprodtec.jpg";

function SocialMedia() {
  return (
    <section className="instagram">
      <div className="social-container">
        <img src={instagram} alt="Instagram" className="instagram-image" />
        <div className="text-content">
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
