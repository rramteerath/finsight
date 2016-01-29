import React from 'react';
import * as portModel from '../../models/portfolioModel';

class PortfolioList extends React.Component {
	// With es6, the getInitialState is replaced by the constructor.
	constructor(props) {
		super(props);

		this.state = {
			portfolios: [],
			selectedPortfolio: ""
		}
	}

	// componentDidMount lifecycle event called after the component mounts the view
	componentDidMount() {
		this.init(this.props);
	}

	componentWillReceiveProps(nextProps) {

	}

	componentWillUnmount() {
		console.log(this.state);
	}

	selectPort(portfolioId) {
		// Call passed in function to handle this at a higher level
		console.log("port selected:", portfolioId)
	}

	init(props) {
		portModel.getPortfolioList()
			.then((response) => 
				this.setState({portfolios: response.data, selectedPortfolio: response.data[0].name })
			)
	}

	render() {
		return (
			<div className="dropdown">
				<button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">{this.state.selectedPortfolio}
			  <span className="caret"></span></button>
		    <ul className="dropdown-menu">
		      {this.state.portfolios.map((repo, index) => {
		      	return (
							<li key={index}><a href="#" onClick={() => this.selectPort(repo.id)}>{repo.name}</a></li>
						)
					})}
			  </ul>
			</div>
		)
	}
}

export default PortfolioList;
