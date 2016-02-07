import React from 'react'
import * as tickerModel from '../../models/tickerModel'
import * as transTypeModel from '../../models/transTypeModel'
import * as transactionModel from '../../models/transactionModel'
import axios from 'axios'
import './TransEdit.sass'

class TransEdit extends React.Component {
	// With es6, the getInitialState is replaced by the constructor.
	constructor(props) {
		super(props);

		this.state = {
			allTickers: [],
			allTransTypes: [],
			selectedTransType: {}
		}
	}

	// componentDidMount lifecycle event called after the component mounts the view
	componentDidMount() {
		this.init(this.props);
	}

	// Receive props when they change
	componentWillReceiveProps(nextProps) {

	}

	componentWillUnmount() {

	}

	init(props) {
		$( "#execdate" ).datepicker()

		tickerModel.getTickerList()
			.then((response) => {
				this.setState({ allTickers: response.data })

				const tickers = this.state.allTickers.map(t => t.symbol)
				$( "#tickerAuto" ).autocomplete({source: tickers})
			})

		transTypeModel.getTransTypeList()
			.then((response) => {
				this.setState({ allTransTypes: response.data, selectedTransType: response.data[0]})
			})

		// axios.defaults.headers.common['Cookie'] = '3481%5F0=6BE7358E16EB39BA6744524E06AA2E67; GZIP=1';
		// axios.get('http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=MSFT&')
		// 	.then((res) => console.log("stock data", res))
	}

	mycallback() {
		console.log("in my callback")
	}

	handleSubmit() {
		const trans = { 
			"executionDate": this.dateInput.value, 
			"transactionTypeId": this.state.selectedTransType.id, 
			"transType": this.state.selectedTransType.name, 
			"ticker": this.tickerInput.value, 
			"tickerId": _.find(this.state.allTickers, (i) => i.symbol == this.tickerInput.value).id,
			"quantity": this.quantInput.value, 
			"price": this.priceInput.value, 
			"commission": this.commInput.value,
			"portfolioId": this.props.currentPortfolio.id
		}

		transactionModel.saveTransaction(trans)
			.then((res) => {
				this.props.transactionsChanged()

				// Clear fields after save
				this.edittransform.reset()
			})
	}

	selectTransType(transType) {
		this.setState({selectedTransType: transType})
	}

	render() {
		return (
			<div>
				<form id="edittransform" ref={(ref) => this.edittransform = ref}>

					<div className="row">
		    		<div className="col-sm-12"><h3>Add/Edit Transaction</h3></div>
		    	</div>

		    	<div className="row">
		    		<div className="col-sm-2">
		    			<input type="text" className="form-control" id="execdate" placeholder="date"
		    				ref={(ref) => this.dateInput = ref}>
		    			</input>
		    		</div>
		    		<div className="col-sm-1">
							<div className="dropdown">
								<button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">{this.state.selectedTransType.name}
							  	<span className="caret caret-pos"></span>
							  </button>
						    <ul className="dropdown-menu">
						      {this.state.allTransTypes.map((repo, index) => {
						      	return (
											<li key={index}><a href="#" onClick={() => this.selectTransType(repo)}>{repo.name}</a></li>
										)
									})}
							  </ul>
							</div>
		    		</div>

		    		<div className="col-sm-2">
		    			<input type="text" className="form-control" id="tickerAuto" placeholder="ticker"
		    				ref={(ref) => this.tickerInput = ref}>
		    			</input>
		    		</div>

		    		<div className="col-sm-2">
		    			<input type="text" className="form-control" id="quantity" placeholder="quantity"
		    				ref={(ref) => this.quantInput = ref}>
		    			</input>
		    		</div>

		    		<div className="col-sm-2">
		    			<input type="text" className="form-control" id="price" placeholder="price"
		    				ref={(ref) => this.priceInput = ref}>
		    			</input>
		    		</div>

		    		<div className="col-sm-2">
		    			<input type="text" className="form-control" id="comm" placeholder="commission"
		    				ref={(ref) => this.commInput = ref}>
		    			</input>
		    		</div>

		    		<div className="col-sm-1">
		    			<button type="button" className="btn btn-success" onClick={() => this.handleSubmit()}>Submit</button>
		    		</div>
		    	</div>

	    	</form>
	    </div>
		)
	}
}

TransEdit.propTypes = {
	currentPortfolio: React.PropTypes.object.isRequired,
	transactionsChanged: React.PropTypes.func.isRequired
}

export default TransEdit;
