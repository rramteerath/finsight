/// <reference path="./ICurrencyFormatterProps.d.ts"/>
import * as React from "react";
import { NumberUtils } from '../../utils/NumberUtils';

class CurrencyFormatter extends React.Component<ICurrencyFormatterProps, {}> {
	constructor(props: ICurrencyFormatterProps){
		super(props)
	}

	render() {
		return (
      <div>{ NumberUtils.formatCurrency(this.props.data) }</div>
	)}
}

export { CurrencyFormatter }
