const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const Identicon = require('./identicon')
const prefixForNetwork = require('../../lib/etherscan-prefix-for-network')

module.exports = TokenCell

inherits(TokenCell, Component)
function TokenCell () {
  Component.call(this)
}

TokenCell.prototype.render = function () {
  const props = this.props
  const { address, symbol, string, network, userAddress } = props

  return (
    h('li.token-cell', {
      style: { 
        cursor: network === '1' ? 'pointer' : 'default',
        borderBottom: props.isLastTokenCell ? 'none' : '1px solid #e2e2e2',
        padding: '20px 0',
        margin: '0 20px',
      },
      onClick: this.view.bind(this, address, userAddress, network),
    }, [

      h(Identicon, {
        diameter: 50,
        address,
        network,
      }),

      h('h3', {
        style: {
          fontFamily: 'Nunito Bold',
          fontSize: '14px',
        }
      }, `${string || 0} ${symbol}`),

      h('span', { style: { flex: '1 0 auto' } }),

      h('span.fa.fa-trash', {
        style: { cursor: 'pointer' },
        onClick: (event) => {
          event.stopPropagation()
          this.props.removeToken({ address, symbol, string, network, userAddress })
        },
      }, ''),

      h('hr')

      /*
      h('button', {
        onClick: this.send.bind(this, address),
      }, 'SEND'),
      */

    ])
  )
}

TokenCell.prototype.send = function (address, event) {
  event.preventDefault()
  event.stopPropagation()
  const url = tokenFactoryFor(address)
  if (url) {
    navigateTo(url)
  }
}

TokenCell.prototype.view = function (address, userAddress, network, event) {
  const url = etherscanLinkFor(address, userAddress, network)
  if (url) {
    navigateTo(url)
  }
}

function navigateTo (url) {
  global.platform.openWindow({ url })
}

function etherscanLinkFor (tokenAddress, address, network) {
  const prefix = prefixForNetwork(network)
  return `https://${prefix}etherscan.io/token/${tokenAddress}?a=${address}`
}

function tokenFactoryFor (tokenAddress) {
  return `https://tokenfactory.surge.sh/#/token/${tokenAddress}`
}

