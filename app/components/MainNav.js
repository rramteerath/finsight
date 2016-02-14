import React from 'react'

const MainNav = ({history, children}) => {


  return (
    <div className="main-container">
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">

          <div className="navbar-header">
            <a className="navbar-brand" href="/">FinSight</a>
          </div>
          <ul className="nav navbar-nav">
            <li><a href="/#main">Portfolios</a></li>
            <li><a href="/#price">Price</a></li>
          </ul>
        </div>
      </nav>

      <div>
        {children}
      </div>
    </div>
  )
}

export default MainNav
