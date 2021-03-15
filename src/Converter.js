import React from 'react'
import { DecomposePrimeFactor } from '../src/Shangshu-calendar/convert_decompose-prime-factor'
import { CongruenceModulo } from '../src/Shangshu-calendar/convert_congruence-modulo'
import { Jd2Date1, Date2Jd } from '../src/Shangshu-calendar/convert_jd2date'

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
      yy: '',
      mm: '',
      dd: '',
      outputDecompse: null,
      outputModulo: null,
      outputJd: null,    
      outputDate: null,    
    }
    this.handleConvertDecompose = this.handleConvertDecompose.bind(this)
    this.handleConvertModulo = this.handleConvertModulo.bind(this)
    this.handleConvertJd = this.handleConvertJd.bind(this)
    this.handleConvertDate = this.handleConvertDate.bind(this)
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
        <span>鍵入兩箇互質整數</span>
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
        <input className='InputJd'
          value={this.state.jd}
          onChange={(e) => {
            this.setState({ jd: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  renderConverterInputDate () {
    return (
      <span className='year-select'>
        <input className='InputDate'
          value={this.state.yy}
          onChange={(e) => {
            this.setState({ yy: e.currentTarget.value });
          }}
        />
        <span>年</span>
        <input className='InputDate'
          value={this.state.mm}
          onChange={(e) => {
            this.setState({ mm: e.currentTarget.value });
          }}
        />
        <span>月</span>
        <input className='InputDate'
          value={this.state.dd}
          onChange={(e) => {
            this.setState({ dd: e.currentTarget.value });
          }}
        />
        <span>日</span>
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
      const { Result } = Jd2Date1(this.state.jd)
      this.setState({ outputJd: Result })
    } catch (e) {
        alert(e.message)
    }
  }

  handleConvertDate () {
    try {
      const { Result } = Date2Jd(this.state.yy, this.state.mm, this.state.dd)
      this.setState({ outputDate: Result })
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

  renderResultDate () {
    if (!this.state.outputDate) {
      return null
    }
    return (
      <div>        
        <p>{this.state.outputDate}</p>
      </div>
    )
  }


  render () {
    return (
      <section>
        <div className='convert-div'>
        <h2>調日法</h2>
        {this.renderConverterInputDecompose()}
        <button onClick={this.handleConvertDecompose} className='button4-1'>李銳來也∞</button>
        {this.renderResultDecompose()}
        </div>
        <div className='convert-div'>
        <h2>大衍求一術</h2>
        {this.renderConverterInputModulo()}
        <button onClick={this.handleConvertModulo} className='button4-2'>秦九韶再世⌘</button>
        {this.renderResultModulo()}
        </div>
        <div className='convert-div'>
        <h2>儒略日、日期轉換</h2>
        {this.renderConverterInputJd()}
        <button onClick={this.handleConvertJd} className='button4-6'>JD2date</button>
        {this.renderResultJd()}
        <p></p>
        {this.renderConverterInputDate()}
        <button onClick={this.handleConvertDate} className='button4-6'>Date2Jd</button>
        {this.renderResultDate()}
        </div>
      </section>
    )
  }
}