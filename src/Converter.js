import React from 'react'
import { DecomposePrimeFactor } from '../src/Shangshu-calendar/convert_decompose-prime-factor'
import { CongruenceModulo, ContinuedFrac } from '../src/Shangshu-calendar/convert_congruence-modulo'
import { Jd2Date1, Date2Jd } from '../src/Shangshu-calendar/convert_jd2date'
import MathJax from './Mathjax'
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
      outputModulo: null,
      outputDecompse: null,
      outputContinuedFrac: null,
      outputJd: null,
      outputDate: null,
    }
    this.handleConvertModulo = this.handleConvertModulo.bind(this)
    this.handleConvertDecompose = this.handleConvertDecompose.bind(this)
    this.handleConvertContinuedFrac = this.handleConvertContinuedFrac.bind(this)
    this.handleConvertJd = this.handleConvertJd.bind(this)
    this.handleConvertDate = this.handleConvertDate.bind(this)
  }

  renderConverterInputModulo () {
    return (
      <span className='year-select Decompose'>
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

  renderConverterInputContinuedFrac () {
    return (
      <span className='year-select Decompose'>
        <span>分子</span>
        <input
          value={this.state.fracA}
          onChange={(e) => {
            this.setState({ fracA: e.currentTarget.value });
          }}
        />
        <span> 分母</span>
        <input
          value={this.state.fracB}
          onChange={(e) => {
            this.setState({ fracB: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  renderConverterInputDecompose () {
    return (
      <span className='year-select Decompose'>
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


  handleConvertModulo () {
    try {
      const { Print } = CongruenceModulo(this.state.aRaw, this.state.bRaw)
      this.setState({ outputModulo: Print })
    } catch (e) {
        alert(e.message)
    }
  }

  handleConvertContinuedFrac () {
    try {
      const { gcdPrint, z, zPrint, Result } = ContinuedFrac(this.state.fracA, this.state.fracB)
      this.setState({ outputContinuedFrac: gcdPrint,outputContinuedFrac1: zPrint, outputContinuedFrac2: Result,outputContinuedFrac3: z }) //{this.state.outputContinuedFrac3}
    } catch (e) {
        alert(e.message)
    }
  }
  convertLatex (nums) {
    let str = ''
    nums.reverse().forEach((x) => {
      if (!str) {
        str = `1 \\over {${x}}`
      } else {
        str = `${x} + {1 \\over {${str}}}`
      }
    })
    return `\\[${str}\\]`
  }

  handleConvertDecompose () {
    try {
      const { SmallPrint, Result, Foot } = DecomposePrimeFactor(this.state.a, this.state.b, this.state.bigNumer, this.state.bigDenom)
      this.setState({ outputDecompse: Result, outputDecompse1: SmallPrint, outputDecompse2: Foot  })
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

  renderResultContinuedFrac () {
    if (!this.state.outputContinuedFrac) {
      return null
    }
    return (
      <div>
        <p>{this.state.outputContinuedFrac}</p>
        <p>{this.state.outputContinuedFrac1}</p>
        <p>{this.state.outputContinuedFrac2}</p>
      </div>
    )
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
      <p>{ this.state.outputDecompse2 }</p>
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

  componentDidMount() {    
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/mathjax@3.0.1/es5/tex-mml-chtml.js";
      script.async = true;
      document.body.appendChild(script)}
  render () {
    return (
      <section>
        <div className='convert-div'>
        <h2>大衍求一術</h2>
        {this.renderConverterInputModulo()}
        <button onClick={this.handleConvertModulo} className='button4-2'>秦九韶再世⌘</button>
        {this.renderResultModulo()}
        </div>
        <div className='convert-div'>
        <h2>連分數逼近</h2>
        {this.renderConverterInputContinuedFrac()}
        <button onClick={this.handleConvertContinuedFrac} className='button4-3'>衝衝衝 !</button>
        {this.renderResultContinuedFrac()}
        {(this.state.outputContinuedFrac3 || []).length > 0 ?
            <MathJax rawLatex={this.convertLatex(this.state.outputContinuedFrac3)}/> : null
        }
        </div>
        <div className='convert-div'>
        <h2>調日法</h2>
        {this.renderConverterInputDecompose()}
        <button onClick={this.handleConvertDecompose} className='button4-1'>李銳是我∞</button>
        {this.renderResultDecompose()}
        </div>
        <div className='convert-div'>
        <h2>儒略日、日期轉換</h2>
        {this.renderConverterInputJd()}
        <button onClick={this.handleConvertJd} className='button4-6'>JD2date</button>
        {this.renderResultJd()}
        <p></p>
        {this.renderConverterInputDate()}
        <button onClick={this.handleConvertDate} className='button4-6'>date2JD</button>
        {this.renderResultDate()}
        </div>
      </section>
    )
  }
}