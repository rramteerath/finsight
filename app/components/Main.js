// es6
import React from 'react'
import PortfolioList from './Portfolio/PortfolioList'
import PortGrid from './Portfolio/PortGrid'
import TransEdit from './Transaction/TransEdit'
import './mainstyle.sass'
 
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

	// Create handler to process portfolio change.
	handlePortfolioChanged(portfolio) {
		this.setState({ currentPortfolio: portfolio })
	}

	render() {
		return (
			<div className="main-container">
				<nav className="navbar navbar-default" role="navigation">
					<div className="col-sm-7 col-sm-offset-4 port-list" >
						<span className="header-title">Search by portfolio:</span>
						<PortfolioList portfolioChanged={(portfolio) => this.handlePortfolioChanged(portfolio)}/>
					</div>
				</nav>

				<div className="container">
					<PortGrid currentPortfolio={this.state.currentPortfolio}/>
				</div>

				<div className="container">
					<TransEdit />
				</div>
			</div>
		)
	}
}

export default Main