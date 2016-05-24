/// <reference path="./ICurrencyFormatterProps.d.ts"/>
import * as React from "react";
import { NumberUtils } from '../../utils/NumberUtils';
import '../../styles/globalStyles.sass'

class PLFormatter extends React.Component<ICurrencyFormatterProps, {}> {
	constructor(props: ICurrencyFormatterProps){
		super(props)
	}

	render() {
		return (
      <div>
      { (this.props.data < 0) ?
        <div className='negative'>
          { NumberUtils.formatCurrency(Math.abs(this.props.data)) }
        </div>
         :
        <div className='positive'>
          { NumberUtils.formatCurrency(Math.abs(this.props.data)) }
        </div>
      }
      </div>
	)}
}

export { PLFormatter }
