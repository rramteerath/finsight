import React from 'react'
import Combobox from 'react-widgets/lib/Combobox'
import * as tickerModel from '../../models/tickerModel'
import * as transTypeModel from '../../models/transTypeModel'
import * as transactionModel from '../../models/transactionModel'
import axios from 'axios'
import './TransEdit.sass'
import 'react-widgets/lib/less/react-widgets.less'

class TransEdit extends React.Component {
	// With es6, the getInitialState is replaced by the constructor.
	constructor(props) {
		super(props);

		this.state = {
			allTickers: [],
			allTransTypes: [],
			selectedTransType: {},
			currentTransaction: {},
			buttonLabel: "Add",
			mode: ""
		}
	}

	// componentDidMount lifecycle event called after the component mounts the view
	componentDidMount() {
		this.init(this.props);
	}


	// Receive props when they change
	componentWillReceiveProps(nextProps) {
		if (!nextProps.selectedTransaction.id)
			return

		if (nextProps.selectedTransaction.id == this.state.currentTransaction.id)
			return

		// Need this clearing flag when clearing out the state after doing an update and raising
		// the transactionsChanged event. The componentWillReceiveProps gets called again and
		// the record that was being edited is reloaded. In this scenario you don't want to reload
		// the record, just exit out.
		if (this.state.mode == "clearing") {
			this.setState({mode: ""})
			return
		}

		//if (this.state.keepState)
		//	return

		// Using a ref to the form elements becuase the onChange event does not fire
		// with date picker, autocomplete. Plus this way I don't have to write an
		// onChange event handler for every element. Just get/set the element value
		// using the ref. Therefore these are uncontrolled compoenets in react speak.
		this.dateInput.value = nextProps.selectedTransaction.formattedExecDate
		this.tickerInput.value = nextProps.selectedTransaction.ticker
		this.quantInput.value = nextProps.selectedTransaction.quantity
		this.commInput.value = nextProps.selectedTransaction.commission
		this.priceInput.value = nextProps.selectedTransaction.price

		this.setState({
			currentTransaction: nextProps.selectedTransaction,
			selectedTransType: _.find(this.state.allTransTypes, a => a.id == nextProps.selectedTransaction.transactionTypeId),
			buttonLabel: "Update"
		})
	}


	componentWillUnmount() {

	}


	init(props) {
		$( "#execdate" ).datepicker()

		tickerModel.getTickerList()
			.then((response) => {
				this.setState({ allTickers: response.data })

				// Set up auto-complete control - from the jQuery UI controls (http://jqueryui.com/)
				const tickers = this.state.allTickers.map(t => t.symbol)
				$( "#tickerAuto" ).autocomplete({source: tickers})
			})

		transTypeModel.getTransTypeList()
			.then((response) => {
				//this.setState({ allTransTypes: response.data.map(i => (i.name) )})
				this.setState({ allTransTypes: response.data, selectedTransType: response.data[0]})
			})
	}

	handleSubmit() {
		const trans = {
			"id": this.state.currentTransaction.id,
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

		console.log("trans", trans)
		transactionModel.saveTransaction(trans)
			.then((res) => {
				this.props.transactionsChanged()

				// Clear fields after save
				this.handleClear()
			})
	}

	handleClear() {
		console.log("in clear")

		this.edittransform.reset()
		this.setState(
			{
				currentTransaction: {},
				selectedTransType: this.state.allTransTypes[0],
				buttonLabel: "Add",
				mode: "clearing"
			})

	}

	selectTransType(transType) {
		console.log("transType", transType)
		this.setState({selectedTransType: transType})
	}

	render() {

		return (
			<div>
				<form id="edittransform" ref={(ref) => this.edittransform = ref}>

					<div className="row">
		    		<div className="col-sm-12"><h3>Add/Edit Transaction</h3></div>
		    	</div>

					{/* Execution Date */}
		    	<div className="row">
		    		<div className="col-sm-2">
		    			<input type="text" className="form-control" id="execdate" placeholder="date"
		    				ref={(ref) => this.dateInput = ref}>
		    			</input>
		    		</div>

						{/* Transaction Type */}
		    		<div className="col-sm-2">
							<Combobox valueField="id" textField="name"
								value={this.state.selectedTransType}
								onChange={val => this.selectTransType(val)}
								data={this.state.allTransTypes} suggest={true}/>
		    		</div>

						{/* Ticker */}
		    		<div className="col-sm-1">
		    			<input type="text" className="form-control" id="tickerAuto" placeholder="ticker"
		    				ref={(ref) => this.tickerInput = ref}>
		    			</input>
		    		</div>

						{/* Quantity */}
		    		<div className="col-sm-1">
		    			<input type="text" className="form-control" id="quantity" placeholder="shares"
							 ref={(ref) => this.quantInput = ref}>
		    			</input>
		    		</div>

						{/* Price */}
		    		<div className="col-sm-2">
		    			<input type="text" className="form-control" id="price" placeholder="price"
								 ref={(ref) => this.priceInput = ref}>
		    			</input>
		    		</div>

						{/* Commission */}
		    		<div className="col-sm-2">
		    			<input type="text" className="form-control" id="comm" placeholder="commission"
								 ref={(ref) => this.commInput = ref}>
		    			</input>
		    		</div>

						{/* Buttons */}
		    		<span className="col-sm-2 align-right">
		    			<button type="button" className="btn btn-success" onClick={() => this.handleSubmit()}>
		    				{this.state.buttonLabel}
		    			</button>
		    			<button type="button" className="btn btn-success padded" onClick={() => this.handleClear()}>
		    				Clear
		    			</button>
		    		</span>
		    	</div>

	    	</form>
	    </div>
		)
	}
}

TransEdit.propTypes = {
	currentPortfolio: React.PropTypes.object.isRequired,
	selectedTransaction: React.PropTypes.object,
	transactionsChanged: React.PropTypes.func.isRequired
}

export default TransEdit;
