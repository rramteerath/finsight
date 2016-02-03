import React from 'react'
import * as portModel from '../../models/portfolioModel'

class PortfolioList extends React.Component {
	// With es6, the getInitialState is replaced by the constructor.
	constructor(props) {
		super(props);

		this.state = {
			portfolios: [],
			selectedPortfolioName: ""
		}
	}

	// componentDidMount lifecycle event called after the component mounts the view
	componentDidMount() {
		this.init(this.props)
	}

	componentWillReceiveProps(nextProps) {

	}

	componentWillUnmount() {
		console.log(this.state)
	}

	selectPortfolio(portfolio) {
		// Call passed in function to handle this at a higher level
		this.setState({ selectedPortfolioName: portfolio.name })
		this.props.portfolioChanged(portfolio)
	}

	init(props) {
		portModel.getPortfolioList()
			.then((response) => {
				this.setState({ portfolios: response.data })
				this.selectPortfolio(response.data[0])
			})
	}

	render() {
		return (
			<div className="dropdown">
				<button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">{this.state.selectedPortfolioName}
			  <span className="caret"></span></button>
		    <ul className="dropdown-menu">
		      {this.state.portfolios.map((repo, index) => {
		      	return (
							<li key={index}><a href="#" onClick={() => this.selectPortfolio(repo)}>{repo.name}</a></li>
						)
					})}
			  </ul>
			</div>
		)
	}
}

PortfolioList.propTypes = {
	portfolioChanged: React.PropTypes.func.isRequired
}

export default PortfolioList
