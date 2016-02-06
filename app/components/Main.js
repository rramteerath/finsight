// es6
import React from 'react'
import PortfolioList from './Portfolio/PortfolioList'
import PortGrid from './Portfolio/PortGrid'
import './main.sass'
import '../styles/globalStyles.sass'
 
// props passed into Main
// Use object destructuring to change props -> {history, children}
// So const Main = (props) => {...}
// becomes...
class Main extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			currentPortfolio: {}
		}
	}

	// Create handler to process portfolio change i.e. moving from portfolio to another.
	handlePortfolioChanged(portfolio) {
		this.setState({ currentPortfolio: portfolio })
	}

	render() {
		return (
			<div className="main-container">
				<nav className="navbar navbar-default" role="navigation">
					<div className="col-sm-7 col-sm-offset-4" >
						<span className="header-title">Search by portfolio:</span>
						<PortfolioList portfolioChanged={(portfolio) => this.handlePortfolioChanged(portfolio)}/>
					</div>
				</nav>

				<div>
					<PortGrid currentPortfolio={this.state.currentPortfolio}/>
				</div>
			</div>
		)
	}
}

export default Main