// es6
import React from 'react';
import PortfolioList from './Portfolio/PortfolioList';
import PortGrid from './Portfolio/PortGrid';
import './mainstyle.sass';
 
// props passed into Main
// Use object destructuring to change props -> {history, children}
// So const Main = (props) => {...}
// becomes...
const Main = ({history, children}) => {
	return (
		<div className="main-container">
			<nav className="navbar navbar-default" role="navigation">
				<div className="col-sm-7 col-sm-offset-4 port-list" >
					<span className="header-title">Search by portfolio:</span>
					<PortfolioList/>
				</div>
			</nav>

			<div className="container">
				<PortGrid/>
			</div>
		</div>
	)
}

export default Main;