import React from 'react'
import {Map, toJSON} from 'immutable';
import * as portModel from '../../models/portfolioModel'
import './PortfolioList.sass'

class PortfolioList extends React.Component {

	// componentDidMount lifecycle event called after the component mounts the view
	componentDidMount() {
		this.init(this.props)
	}

	componentWillReceiveProps(nextProps) {

	}

	init(props) {
		this.props.loadPortfolios()
	}

	render() {
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
