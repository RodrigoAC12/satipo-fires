import React from 'react';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-info">
        <h1>Panel de Control de Incendios</h1>
        <p>Datos en tiempo real de la Provincia de Satipo</p>
      </div>
      <div className="user-profile">
        <div className="avatar">JD</div>
        <span>Analista</span>
      </div>
    </header>
  );
};

export default Header;