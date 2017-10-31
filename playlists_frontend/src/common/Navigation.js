import React from 'react';

const Navigation = ({title, description, children}) => (
  <nav className="navbar navbar-dark bg-dark">
    <div className="navbar-brand">{title}</div>
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <div className="navbar-text">{description}</div>
      </li>
    </ul>
    <div className="nav">
      {children}
    </div>
  </nav>
);

export default Navigation;
