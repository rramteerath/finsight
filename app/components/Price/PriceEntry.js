import React from 'react'
import * as tickerModel from '../../models/tickerModel'
import * as priceModel from '../../models/priceModel'
import '../../styles/globalStyles.sass'

class PriceEntry extends React.Component {
  // With es6, the getInitialState is replaced by the constructor.
  constructor(props) {
    super(props)

    this.state = {
      // TODO: Cache tickers on client
      allTickers: [],
      priceMap: new Map(),
      date: Date.now(),
      prices: []
    }
  }

  componentDidMount() {
    this.init(this.props);
  }

  init(props) {
    $( "#date" ).datepicker()
    this.dateInput.value = new Date(this.state.date).toLocaleDateString('en-US')
  }

  handleDateEntry() {
    this.setState({date: this.dateInput.value, haveDate: true})
    //this.getTickers()
    priceModel.getPriceEntryList(this.dateInput.value)
      .then((res) =>{
        console.log("in date entry", res)
        this.setState({allTickers: res.tickers, prices: res.prices})
        this.state.prices.forEach(p => {
          const priceWithTicker = _.find(this.state.allTickers, i => i.id === p.tickerId)
          if (priceWithTicker)
            console.log("symbol", priceWithTicker.symbol)
            $("#" + priceWithTicker.symbol).val(p.price)
        })
      })
  }

  getTickers() {
    tickerModel.getTickerList()
      .then((response) => {
        this.setState({allTickers: response.data})
      })
  }

  handleTextChange(e) {
    this.setState({priceMap: this.state.priceMap.set(e.target.id, e.target.value)})
  }

  handleSubmit() {
    this.state.priceMap.forEach((value, key) => {
      const tickerId = _.find(this.state.allTickers, t => t.symbol == key).id
      const price = {
        "date": this.state.date,
        "tickerId": tickerId,
        "id": _.find(this.state.prices, p => p.tickerId == tickerId).id,
        "price": value
      }

      console.log("price", price)

      //priceModel.savePrice(price)
      //  .then((res) => {
      //    // TODO: clear form, state params, etc.
      //  })
    })
  }

  getPriceForTicker(tickerId) {
    const price = _.find(this.state.prices, p => p.tickerId == tickerId)
    if (price)
      return price.price
    else
      return 0
  }

  render() {
    return (
      <div className="container">
        <form className="form-horizontal" role="form" id="priceEntryForm" ref={(ref) => this.priceEntryForm = ref}>

          <div className="form-group">
            <div className="col-sm-12"><h3>Enter Price History</h3></div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-2">Closing Date</label>
            <div className="col-sm-2">
              <input type="text" className="form-control" id="date" placeholder="date"
                ref={(ref) => this.dateInput = ref}>
              </input>
            </div>
            {
              this.state.haveDate ? null :
              <button type="button" className="col-sm-1 btn btn-success" onClick={() => this.handleDateEntry()}>
                Submit
              </button>
            }
            <div className="col-sm-7"></div>
          </div>

        {this.state.allTickers.map((repo, index) => {
          return (
              <div key={index} className="form-group">
                <label className="control-label col-sm-2">{repo.symbol}</label>
                <div className="col-sm-2">
                  <input type="text" className="form-control" id={repo.symbol} placeholder="price"

                    onChange={(i) => this.handleTextChange(i)}/>
                </div>
                <div className="col-sm-8"></div>
              </div>
          )
          })}

          <div className="form-group">
            <div className="col-sm-2"></div>
            <div className="col-sm-2 align-right">
              {
                this.state.haveDate ?
                  <button type="button" className="btn btn-success" onClick={() => this.handleSubmit()}>
                    Submit
                  </button>
                  : null
              }
              </div>
            <div className="col-sm-8"></div>
          </div>
        </form>
      </div>
    )
  }
}

export default PriceEntry
