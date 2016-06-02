import React from 'react'
import {Map, toJSON} from 'immutable';
import * as portModel from '../../models/portfolioModel'
import './PortfolioList.sass'

class PortfolioList extends React.Component {
	// With es6, the getInitialState is replaced by the constructor.
	constructor(props) {
		super(props);

		// this.state = {
		// 	portfolios: [],
		// 	selectedPortfolioName: ""
		// }
	}

	// componentDidMount lifecycle event called after the component mounts the view
	componentDidMount() {
		this.init(this.props)
	}

	componentWillReceiveProps(nextProps) {
		// if (this.props.portfolios.size > 0 &&
		// 	this.nextProps.selectedPortfolio.get('id') != this.props.selectedPortfolio.get('id'))
		// 	this.props.portfolioChanged(this.nextProps.selectedPortfolio)
	// 	//console.log('nextProps', nextProps.portfolios.toJSON())
	//
	// }

	// componentWillUnmount() {
	// 	console.log(this.state)
	}

	// selectPortfolio(portfolio) {
	// 	// Call passed in function to handle this at a higher level
	// 	this.setState({ selectedPortfolioName: portfolio.name })
	// 	this.props.portfolioChanged(portfolio)
	// }

	init(props) {
		//console.log('port list: props', props)
		this.props.loadPortfolios()
		// portModel.getPortfolioList()
		// 	.then((response) => {
		// 		this.setState({ portfolios: _.sortBy(response.data, (s) => s.id) })
		//
		// 		// Select first portfolio
		// 		this.selectPortfolio(_.find(response.data, (i) => i.id == 1))
		// 	})
	}

	render() {
		// console.log("this.props.portfolios", this.props.portfolios.size)
		// console.log("this.props.portfolios.toJSON()[0]", this.props.portfolios.toJSON()[0])
		// console.log("this.props.portfolios.get(0)", this.props.portfolios.get(0))
		// if (this.props.portfolios.size > 0 &&
		// 	this.props.selectedPortfolio.get('id') != this.props.portfolios.get(2).get('id'))
		// 	this.props.portfolioChanged(this.props.portfolios.get(2))

		return (
			<div className="dropdown port-list">
				<button className="btn btn-success dropdown-toggle" type="button" data-toggle="dropdown">{this.props.selectedPortfolio.get('name')}
			  <span className="caret"></span></button>
		    <ul className="dropdown-menu">
		      {this.props.portfolios.map((item, index) => {
		      	return (
							<li key={index}><a href="#" onClick={() => this.props.portfolioChanged(item)}>{item.get('name')}</a></li>
						)
					})}
			  </ul>
			</div>
		)
	}
}

// propTypes for validation
PortfolioList.propTypes = {
	portfolioChanged: React.PropTypes.func.isRequired
}

export default PortfolioList
