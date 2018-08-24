import request from 'request'

export default class Autobots {
  
  constructor({ url, apiToken }) {
    this.url = url || 'http://autobots2.devss.xyz/api/latest'
    this.apiToken = apiToken
  }
  
  async makeTrade(trade) {
    return new Promise((resolve, reject) => {
      if (!trade.itemsToReceive && !trade.itemsToGive) return reject('No items in trade')
      if (!trade.partner && !trade.apiToken) return reject('Trade target is incorrect')
      request.post({
        url: `${this.url}/trade`,
        headers: { 'content-type': 'application/json', 'x-api-token': this.apiToken },
        body: JSON.stringify(trade)
      }, (error, response, body) => {
        if (error) return reject(`Create trade error:`, error)
        if (response.statusCode !== 201) return reject(`Create trade response code:`, response.statusCode)
        resolve(JSON.parse(body).message)
      })
    })
  }
  
  async makeTradeWithId(trade) {
    return new Promise((resolve, reject) => {
      if (!trade.itemsToGive.length) return reject('No items in trade')
      if (!trade.partner && !trade.apiToken) return reject('Trade target is incorrect')
      request.post({
        url: `${this.url}/trade-with-skins`,
        headers: { 'content-type': 'application/json', 'x-api-token': this.apiToken },
        body: JSON.stringify(trade)
      }, (error, response, body) => {
        if (error) return reject(`Create trade error:`, error)
        if (response.statusCode !== 201) return reject(`Create trade response code:`, response.statusCode)
        resolve(JSON.parse(body).message)
      })
    })
  }
  
  async makeTradeById(trade) {
    return new Promise((resolve, reject) => {
      if (!trade.itemsToGive.length) return reject('No items in trade')
      if (!trade.partner && !trade.apiToken) return reject('Trade target is incorrect')
      request.post({
        url: `${this.url}/trade-by-skins`,
        headers: { 'content-type': 'application/json', 'x-api-token': this.apiToken },
        body: JSON.stringify(trade)
      }, (error, response, body) => {
        if (error) return reject(`Create trade error:`, error)
        if (response.statusCode !== 201) return reject(`Create trade response code:`, response.statusCode)
        resolve(JSON.parse(body).message)
      })
    })
  }

}