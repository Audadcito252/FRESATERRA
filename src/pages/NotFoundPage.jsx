import React, { useEffect } from 'react';

const NotFoundPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Página no encontrada</h1>
      <p style={styles.message}>Lo sentimos, la página que buscas no existe.</p>
      <a href="/" style={styles.link}>Volver a la página de inicio</a>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f9',
    color: '#333',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  message: {
    fontSize: '1.25rem',
    marginBottom: '30px',
  },
  link: {
    fontSize: '1.1rem',
    color: '#007BFF',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default NotFoundPage;
