# Market-Status-Api-Rest

The goal of this project is to create a public API REST that retrieves market information for trading
pairs.

Specifications:
  - Uses Express framework to set up the server.
  - The API exposes two endpoints:
    1. `:/market-status/effective-price/{pair}/{operation}/{amount}?priceLimit={priceLimit}` endpoint. 
      Returns the effective price that will result if the order is executed (i.e. evaluate Market Depth) if price limit is not defined. Returns the maximum order size that could be executed.
    2. `:/market-status/tip-orderbook/{pair}` endpoint. Returns the tips of the orderbook (i.e. thebetter prices for bid-ask).

  - API should return market values for the following pairs: BTC-USD and ETH-USD. We expect
to handle unexpected pairs.
  - This engine is written in Node.js and it uses websockets, without persistent storage. It also supports a HTTP interface to fetch the endpoints.
  The backend consumes data from Bittrex API.

## Installation and Initialization
1. Clone the project
2. in ./Market-Status-Api-Rest run `npm install`
3. run `npm start`

## Unit tests
1. run `npm test`
