import React from 'react'
import { DecomposePrimeFactor } from '../src/Shangshu-calendar/convert_decompose-prime-factor'
import { CongruenceModulo } from '../src/Shangshu-calendar/convert_congruence-modulo'

export default class Converter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      a: '',
      b: '',
      bigNumer: 26,
      bigDenom: 49,
      aRaw: 0,
      bRaw: 0,
      title: '弱率',
      output1: null,
      output2: null
    }
    this.handleConvert1 = this.handleConvert1.bind(this)
    this.handleConvert2 = this.handleConvert2.bind(this)
  }

  renderConverterInput1 () {
    return (
      <span className='year-select'>
        <span>朔餘</span>
        <input
          value={this.state.a}
          onChange={(e) => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span> 日法</span>
        <input
          value={this.state.b}
          onChange={(e) => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span> 彊子</span>
        <input
          value={this.state.bigNumer}
          onChange={(e) => {
            this.setState({ bigNumer: e.currentTarget.value });
          }}
        />
        <span> 彊母</span>
        <input
          value={this.state.bigDenom}
          onChange={(e) => {
            this.setState({ bigDenom: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  renderConverterInput2 () {
    return (
      <span className='year-select'>
        <span>鍵入㒳箇互質整數</span>
        <input
          value={this.state.aRaw}
          onChange={(e) => {
            this.setState({ aRaw: e.currentTarget.value });
          }}
        />
        <input
          value={this.state.bRaw}
          onChange={(e) => {
            this.setState({ bRaw: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handleConvert1 () {
    try {
      const { SmallPrint, Result } = DecomposePrimeFactor(this.state.a, this.state.b, this.state.bigNumer, this.state.bigDenom)
      this.setState({ output1: Result })
      this.setState({ output1a: SmallPrint })
    } catch (e) {
      alert(e.message)
    }
  }

  handleConvert2 () {
    try {
      const { Print } = CongruenceModulo(this.state.aRaw, this.state.bRaw)
      console.log(Print)
      this.setState({ output2: Print })
    } catch (e) {
        alert(e.message)
    }
  }

  renderResult1 () {
    if (!this.state.output1) {
      return null
    }
    return (
      <div className='renderConverterInput1'>
        <p>{ this.state.output1a }</p>
      <table>
        <tr>
          <th></th>
          <th>朔餘</th>
          <th>日法</th>
          <th>約餘</th>
        </tr>
      {(this.state.output1 || []).map((row) => {
        return (
          <tr>
            <td className='ConverterInput1Name'>{row.title}</td>
            {row.data.map((d) => {
              return (<td>{d}</td>)
            })}
          </tr>
        )
      })}
      </table>
      </div>
    )
  }

  renderResult2 () {
    if (!this.state.output2) {
      return null
    }
    return (
      <div>
        <p>{this.state.output2}</p>
      </div>
    )
  }

  render () {
    return (
      <div>
        <h2>調日法</h2>
        {this.renderConverterInput1()}
        <button onClick={this.handleConvert1}>李銳來也∞</button>
        {this.renderResult1()}
        <h2>大衍求一術</h2>
        {this.renderConverterInput2()}
        <button onClick={this.handleConvert2}>秦九韶再世⌘</button>
        {this.renderResult2()}
      </div>
    )
  }
}