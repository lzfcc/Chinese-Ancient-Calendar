import React from 'react'
import { DecomposePrimeFactor } from '../src/Shangshu-calendar/convert_decompose-prime-factor'
import { CongruenceModulo } from '../src/Shangshu-calendar/convert_congruence-modulo'
import { Jd2Date } from '../src/Shangshu-calendar/convert_jd2date'

export default class Converter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      a: '',
      b: '',
      bigNumer: 26,
      bigDenom: 49,
      aRaw: '',
      bRaw: '',
      title: '弱率',
      jd: '',
      outputDecompse: null,
      outputModulo: null,
      outputJd:null,    
    }
    this.handleConvertDecompose = this.handleConvertDecompose.bind(this)
    this.handleConvertModulo = this.handleConvertModulo.bind(this)
    this.handleConvertJd = this.handleConvertJd.bind(this)
  }

  renderConverterInputDecompose () {
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

  renderConverterInputModulo () {
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

  renderConverterInputJd () {
    return (
      <span className='year-select'>
        <span>儒略日</span>
        <input
          value={this.state.jd}
          onChange={(e) => {
            this.setState({ jd: e.currentTarget.value });
          }}
        />
      </span>
    );
  }



  handleConvertDecompose () {
    try {
      const { SmallPrint, Result } = DecomposePrimeFactor(this.state.a, this.state.b, this.state.bigNumer, this.state.bigDenom)
      this.setState({ outputDecompse: Result })
      this.setState({ outputDecompse1: SmallPrint })
    } catch (e) {
      alert(e.message)
    }
  }

  handleConvertModulo () {
    try {
      const { Print } = CongruenceModulo(this.state.aRaw, this.state.bRaw)
      this.setState({ outputModulo: Print })
    } catch (e) {
        alert(e.message)
    }
  }

  handleConvertJd () {
    try {
      const { Print } = Jd2Date(this.state.jd)
      this.setState({ outputJd: Print })
    } catch (e) {
        alert(e.message)
    }
  }



  renderResultDecompose () {
    if (!this.state.outputDecompse) {
      return null
    }
    return (
      <div className='renderConverterInputDecompose'>
        <p>{ this.state.outputDecompse1 }</p>
      <table>
        <tr>
          <th></th>
          <th>朔餘</th>
          <th>日法</th>
          <th>約餘</th>
        </tr>
      {(this.state.outputDecompse || []).map((row) => {
        return (
          <tr>
            <td className='ConverterInputDecomposeName'>{row.title}</td>
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

  renderResultModulo () {
    if (!this.state.outputModulo) {
      return null
    }
    return (
      <div>
        <p>{this.state.outputModulo}</p>
      </div>
    )
  }

  renderResultJd () {
    if (!this.state.outputJd) {
      return null
    }
    return (
      <div>
        <p>{this.state.outputJd}</p>
      </div>
    )
  }



  render () {
    return (
      <div>
        <h2>調日法</h2>
        {this.renderConverterInputDecompose()}
        <button onClick={this.handleConvertDecompose} className='button4-1'>李銳來也∞</button>
        {this.renderResultDecompose()}
        <h2>大衍求一術</h2>
        {this.renderConverterInputModulo()}
        <button onClick={this.handleConvertModulo} className='button4-2'>秦九韶再世⌘</button>
        {this.renderResultModulo()}
        <h2>儒略日轉換</h2>
        {this.renderConverterInputJd()}
        <button onClick={this.handleConvertJd} className='button4-6'>Bingo!</button>
        {this.renderResultJd()}
      </div>
    )
  }
}