import React from 'react'
import './PortfolioList.sass'

class GridEditButtons extends React.Component {
	constructor(props){
		super(props)
		
		console.log("grid edit button data", props)

	}

	render() {
		return (
			<div className="grid-edit-buttons">
				<a href="#" onClick={() => this.editTrans(props.currentTrans)} title="Edit Transaction"><span className="glyphicon glyphicon-pencil"></span></a>
				<a href="#" onClick={() => this.deleteTrans(props.currentTrans)} title="Delete Transaction"><span className="glyphicon glyphicon-remove"></span></a>
			</div>
		)
	}
}

export default GridEditButtons