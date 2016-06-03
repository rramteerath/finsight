import React from 'react';

import '../styles/globalStyles.sass'
import './main.sass';

export default class MainNavBar extends React.Component {

  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand app-title" href="/">FinSight</a>
            </div>
            <ul className="nav navbar-nav">
              <li><a href="/">Portfolios</a></li>
              <li><a href="/#price">Price</a></li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}
