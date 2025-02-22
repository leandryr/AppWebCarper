import React from 'react';
import styles from '../styles/Index.module.css'; // Usando CSS Module

const Index = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>¡Registro Cerrado!</h1>
        <p className={styles.subtitle}>Gracias por formar parte de esta experiencia.</p>
        <p className={styles.paragraph}>
          Nos alegra que hayas participado. 
          <br />
          Te esperamos en el próximo evento con más sorpresas.
        </p>
        <div className={styles.divider}></div>
        <p className={styles.footerNote}>Nos vemos pronto.</p>
        <div className={styles.logo}></div>
      </div>
    </div>
  );
};

export default Index;
