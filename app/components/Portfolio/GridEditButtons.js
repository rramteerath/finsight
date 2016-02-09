import React from 'react'
import './PortfolioList.sass'

class GridEditButtons extends React.Component {
	constructor(props){
		super(props)
	}

	render() {
		return (
			<div className="grid-edit-buttons">
				<a href="#" title="Edit Transaction" 
					onClick={() => this.props.metadata.onEditClick(this.props.rowData)}>
					<span className="glyphicon glyphicon-pencil"></span>
				</a>
				<a href="#" title="Delete Transaction" 
					onClick={() => this.props.metadata.onDeleteClick(this.props.rowData)}>
					<span className="glyphicon glyphicon-remove"></span>
				</a>
			</div>
		)
	}
}

export default GridEditButtons