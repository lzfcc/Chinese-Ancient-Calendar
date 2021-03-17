import React from 'react'
import { CongruenceModulo, ContinuedFrac, ContinuedFrac1 } from '../src/Shangshu-calendar/convert_congruence-modulo'
import { DecomposePrimeFactor } from '../src/Shangshu-calendar/convert_decompose-prime-factor'
import { Sunzi, OriginModulo } from '../src/Shangshu-calendar/convert_origin'
import MathJax from './Mathjax'

export default class Modulo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: '',
      b: '',
      list: [],
      bigNumer: 26,
      bigDenom: 49,
      aRaw: '',
      bRaw: '',
      title: '弱率',
      Denom: 16900,
      SolarFrac: 4108,
      LunarFrac: 8967,
      OriginConst: 193440,
      FirstConst: 163771,
      outputModulo: null,
      outputSunzi: null,
      outputDecompse: null,
      outputContinuedFrac: null,
      outputContinuedFrac1: null,
      outputOrigin: null,
    }
    this.handleConvertModulo = this.handleConvertModulo.bind(this)
    this.handleConvertSunzi = this.handleConvertSunzi.bind(this)
    this.handleConvertDecompose = this.handleConvertDecompose.bind(this)
    this.handleConvertContinuedFrac = this.handleConvertContinuedFrac.bind(this)
    this.handleConvertContinuedFrac1 = this.handleConvertContinuedFrac1.bind(this)
    this.handleConvertOrigin = this.handleConvertOrigin.bind(this)
  }


  renderModuloInputModulo() {
    return (
      <span className='year-select width3'>
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

  renderModuloInputSunzi() {
    return (
      <span className='year-select width3'>
        <table>
          <tr>
            <th>x</th>
            <td>
              <span>≡ </span>
              <input
                value={this.state.b1}
                onChange={(e) => {
                  this.setState({ b1: e.currentTarget.value });
                }}
              />
              <span> (mod </span>
              <input
                value={this.state.m1}
                onChange={(e) => {
                  this.setState({ m1: e.currentTarget.value });
                }}
              />
              <span>)</span>
            </td>
          </tr>
          <tr>
            <th></th>
            <td>
              <span>≡ </span>
              <input
                value={this.state.b2}
                onChange={(e) => {
                  this.setState({ b2: e.currentTarget.value });
                }}
              />
              <span> (mod </span>
              <input
                value={this.state.m2}
                onChange={(e) => {
                  this.setState({ m2: e.currentTarget.value });
                }}
              />
              <span>)</span>
            </td>
          </tr>
          <tr>
            <th></th>
            <td>
              <span>≡ </span>
              <input
                value={this.state.b3}
                onChange={(e) => {
                  this.setState({ b3: e.currentTarget.value });
                }}
              />
              <span> (mod </span>
              <input
                value={this.state.m3}
                onChange={(e) => {
                  this.setState({ m3: e.currentTarget.value });
                }}
              />
              <span>)</span>
            </td>
          </tr>
        </table>
      </span>
    );
  }

  renderModuloInputContinuedFrac() {
    return (
      <span className='year-select width3'>
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

  renderModuloInputContinuedFrac1() {
    return (
      <span className='year-select width4'>
        <span>小數</span>
        <input
          value={this.state.Decimal}
          onChange={(e) => {
            this.setState({ Decimal: e.currentTarget.value });
          }}
        />
        {/* <span> 漸進次數</span>
        <input
          value={this.state.Times}
          onChange={(e) => {
            this.setState({ Times: e.currentTarget.value });
          }}
        /> */}
      </span>
    );
  }


  renderModuloInputDecompose() {
    return (
      <span className='year-select width3'>
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

  renderModuloInputOrigin() {
    return (
      <span className='year-select width2'>
        <span>日法</span>
        <input
          value={this.state.Denom}
          onChange={(e) => {
            this.setState({ Denom: e.currentTarget.value });
          }}
        />
        <span> 斗分</span>
        <input
          value={this.state.SolarFrac}
          onChange={(e) => {
            this.setState({ SolarFrac: e.currentTarget.value });
          }}
        />
        <span> 朔餘</span>
        <input
          value={this.state.LunarFrac}
          onChange={(e) => {
            this.setState({ LunarFrac: e.currentTarget.value });
          }}
        />
        <span> 冬至分子</span>
        <input className='width3'
          value={this.state.OriginConst}
          onChange={(e) => {
            this.setState({ OriginConst: e.currentTarget.value });
          }}
        />
        <span> 天正朔分子</span>
        <input className='width3'
          value={this.state.FirstConst}
          onChange={(e) => {
            this.setState({ FirstConst: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handleConvertModulo() {
    try {
      const { Print } = CongruenceModulo(this.state.aRaw, this.state.bRaw)
      this.setState({ outputModulo: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  handleConvertSunzi() {
    try {
      const { Print } = Sunzi(this.state.b1, this.state.m1, this.state.b2, this.state.m2, this.state.b3, this.state.m3)
      this.setState({ outputSunzi: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  handleConvertContinuedFrac() {
    try {
      const { gcdPrint, z, zPrint, Result } = ContinuedFrac(this.state.fracA, this.state.fracB)
      this.setState({ outputContinuedFrac: gcdPrint, outputContinuedFrac1: zPrint, outputContinuedFrac2: Result, outputContinuedFrac3: z })
    } catch (e) {
      alert(e.message)
    }
  }

  handleConvertContinuedFrac1() {
    try {
      const { ans, step, ansPrint } = ContinuedFrac1(this.state.Decimal)
      this.setState({ outputContinuedFrac11: ansPrint, outputContinuedFrac12: step, outputContinuedFrac13: ans })
    } catch (e) {
      alert(e.message)
    }
  }

  convertLatex(nums) {
    let str = ''
    nums.reverse().forEach((x) => {
      if (!str) {
        str = `${x}`
      } else {
        str = `${x} + {1 \\over {${str}}}`
      }
    })
    return `\\[${str}\\]`
  }

  handleConvertDecompose() {
    try {
      const { SmallPrint, Result, Foot } = DecomposePrimeFactor(this.state.a, this.state.b, this.state.bigNumer, this.state.bigDenom)
      this.setState({ outputDecompse: Result, outputDecompse1: SmallPrint, outputDecompse2: Foot })
    } catch (e) {
      alert(e.message)
    }
  }

  handleConvertOrigin() {
    try {
      const { OriginPrint } = OriginModulo(this.state.Denom, this.state.SolarFrac, this.state.LunarFrac, this.state.OriginConst, this.state.FirstConst)
      this.setState({ outputOrigin: OriginPrint })
    } catch (e) {
      alert(e.message)
    }
  }

  renderResultModulo() {
    if (!this.state.outputModulo) {
      return null
    }
    return (
      <div>
        <p>{this.state.outputModulo}</p>
      </div>
    )
  }

  renderResultSunzi() {
    if (!this.state.outputSunzi) {
      return null
    }
    return (
      <div>
        <p>{this.state.outputSunzi}</p>
      </div>
    )
  }

  renderResultContinuedFrac() {
    if (!this.state.outputContinuedFrac) {
      return null
    }
    return (
      <div>
        <p>{this.state.outputContinuedFrac}　　{this.state.outputContinuedFrac1}</p>
        <p>{this.state.outputContinuedFrac2}</p>
      </div>
    )
  }

  renderResultContinuedFrac1() {
    if (!this.state.outputContinuedFrac13) {
      return null
    }
    return (
      <div>
        <p>{this.state.outputContinuedFrac11}</p>
        <p>{this.state.outputContinuedFrac12}</p>
      </div>
    )
  }

  renderResultDecompose() {
    if (!this.state.outputDecompse) {
      return null
    }
    return (
      <div className='renderModuloInputDecompose'>
        <p>{this.state.outputDecompse1}</p>
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
                <td className='ModuloInputDecomposeName'>{row.title}</td>
                {row.data.map((d) => {
                  return (<td>{d}</td>)
                })}
              </tr>
            )
          })}
        </table>
        <p>{this.state.outputDecompse2}</p>
      </div>
    )
  }

  renderResultOrigin() {
    if (!this.state.outputOrigin) {
      return null
    }
    return (
      <div>
        <p>{this.state.outputOrigin}</p>
      </div>
    )
  }

  render() {
    return (
      <section>
        <div className='convert-div'>
          <h2>大衍求一術</h2>
          {this.renderModuloInputModulo()}
          <button onClick={this.handleConvertModulo} className='button4-2'>秦九韶再世⌘</button>
          {this.renderResultModulo()}
        </div>
        <div className='convert-div'>
          <h2>孫子定理</h2>
          {this.renderModuloInputSunzi()}
          <button onClick={this.handleConvertSunzi} className='button4-7'>老子⋯</button>
          {this.renderResultSunzi()}
        </div>
        <div className='convert-div'>
          <h2>連分數逼近</h2>
          <h4>附最大公因數、最小公倍數</h4>
          {this.renderModuloInputContinuedFrac()}
          <button onClick={this.handleConvertContinuedFrac} className='button4-3'>快快快 !</button>
          {(this.state.outputContinuedFrac3 || []).length > 0 ?
            <MathJax rawLatex={this.convertLatex(this.state.outputContinuedFrac3)} /> : null
          }
          {this.renderResultContinuedFrac()}
          <p></p>
          {this.renderModuloInputContinuedFrac1()}
          <button onClick={this.handleConvertContinuedFrac1} className='button4-3'>衝衝衝 !</button>
          {(this.state.outputContinuedFrac13 || []).length > 0 ?
            <MathJax rawLatex={this.convertLatex(this.state.outputContinuedFrac13)} /> : null
          }
          {this.renderResultContinuedFrac1()}
        </div>
        <div className='convert-div'>
          <h2>調日法</h2>
          {this.renderModuloInputDecompose()}
          <button onClick={this.handleConvertDecompose} className='button4-1'>李銳是我∞</button>
          {this.renderResultDecompose()}
        </div>
        <div className='convert-div'>
          <h2>宋曆演紀</h2>
          {this.renderModuloInputOrigin()}
          <button onClick={this.handleConvertOrigin} className='button4-5'>上元積年</button>
          {this.renderResultOrigin()}
        </div>
      </section>
    )
  }
}