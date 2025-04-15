import React from 'react';
import { Link } from 'react-router-dom';
import { FaTools, FaHardHat, FaCog, FaArrowLeft } from 'react-icons/fa';
import { BiError } from 'react-icons/bi';
import { AiOutlineLoading } from 'react-icons/ai';
import styles from './UnderConstruction.module.css';

const UnderConstruction = () => {
  return (
    <div className={styles.constructionPage}>
      <div className={styles.container}>
        <div className={styles.constructionContent}>
          <div className={styles.iconGrid}>
            <FaHardHat className={styles.constructionIcon} />
            <FaTools className={styles.constructionIcon} />
            <BiError className={styles.constructionIcon} />
            <FaCog className={`${styles.constructionIcon} ${styles.spinning}`} />
          </div>
          
          <h1 className={styles.constructionTitle}>PÁGINA EM CONSTRUÇÃO</h1>
          
          <p className={styles.constructionDescription}>
            Estamos trabalhando para melhorar sua experiência. <br />
            Em breve este conteúdo estará disponível.
          </p>
          
          <div className={styles.loadingIndicator}>
            <AiOutlineLoading className={styles.loadingIcon} />
            <span>Carregando progresso</span>
          </div>
          
          <Link to="/" className={styles.backButton}>
            <FaArrowLeft className={styles.buttonIcon} />
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;