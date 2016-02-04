import React from 'react'
// import * as portModel from '../../models/transModel'

class TransEdit extends React.Component {
	// With es6, the getInitialState is replaced by the constructor.
	constructor(props) {
		super(props);

		this.state = {
			currentTransaction: {}
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
	}

	handleSubmit() {
		const trans = { 
			"executionDate": this.dateInput.value, 
			"transType": this.typeInput.value, 
			"ticker": this.tickerInput.value, 
			"quantity": this.quantInput.value, 
			"price": this.priceInput.value, 
			"commission": this.commInput.value
		} 

		console.log("trans", trans)
	}

	render() {
		return (
			<div>
				<form >
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
		    			<input type="text" className="form-control" id="type" placeholder="type"
		    				ref={(ref) => this.typeInput = ref}>
		    			</input>
		    		</div>
		    		<div className="col-sm-2">
		    			<input type="text" className="form-control" id="ticker" placeholder="ticker"
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

// TransEdit.propTypes = {
// 	currentPortfolio: React.PropTypes.object.isRequired
// }

export default TransEdit;
