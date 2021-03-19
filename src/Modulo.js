import React from 'react'
import { CongruenceModulo, ContinuedFrac, ContinuedFrac1 } from '../src/Shangshu-calendar/convert_congruence-modulo'
import { DecomposePrimeFactor } from '../src/Shangshu-calendar/convert_decompose-prime-factor'
import { Sunzi, IndetermEqua,IndetermEqua1, OriginModulo } from '../src/Shangshu-calendar/convert_origin'
import MathJax from './Mathjax'

export default class Modulo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 399,
      b: 752,
      aa1: 49,
      bb1: 17,
      zz1: 752,
      aa2: '',
      bb2: '',
      zz2: '',
      fracA: 399,
      fracB: 752,
      bigNumer: 26,
      bigDenom: 49,
      aRaw: 49,
      bRaw: 26,
      title: '弱率',
      sunziIn: '2,3;5,7;251,8;4237,11;963,13', 
      Denom: 16900,
      SolarFrac: 4108,
      OriginConst: 193440,
      FirstConst: 163771,
      outputModulo: null,
      outputIndetermEqua: null,
      outputIndetermEqua1: null,
      outputSunzi: null,
      outputDecompse: null,
      outputContinuedFrac: null,
      outputContinuedFrac1: null,
      outputOrigin: null,
    }
    this.handleConvertModulo = this.handleConvertModulo.bind(this)
    this.handleConvertIndetermEqua = this.handleConvertIndetermEqua.bind(this)
    this.handleConvertIndetermEqua1 = this.handleConvertIndetermEqua1.bind(this)
    this.handleConvertSunzi = this.handleConvertSunzi.bind(this)
    this.handleConvertDecompose = this.handleConvertDecompose.bind(this)
    this.handleConvertContinuedFrac = this.handleConvertContinuedFrac.bind(this)
    this.handleConvertContinuedFrac1 = this.handleConvertContinuedFrac1.bind(this)
    this.handleConvertOrigin = this.handleConvertOrigin.bind(this)
  }


  renderModuloInputModulo() {
    return (
      <span className='year-select width3'>
        <p className='note'>萬法之法。孫子定理、不定方程、調日法、演紀都需要求一術。本頁面所有輸入均需爲整數（連分數的小數逼近除外）</p>
        <input
          value={this.state.aRaw}
          onChange={(e) => {
            this.setState({ aRaw: e.currentTarget.value });
          }}
        />
        <span> × z ≡ 1 (mod </span>
        <input
          value={this.state.bRaw}
          onChange={(e) => {
            this.setState({ bRaw: e.currentTarget.value });
          }}
        />
        <span>)</span>
      </span>
    );
  }

  renderModuloInputIndetermEqua1() {
    return (
      <span className='year-select width3'>
        <p className='note'>ax - by = z 等價於 ax ≡ z (mod y)</p>
        <input
          value={this.state.aa2}
          onChange={(e) => {
            this.setState({ aa2: e.currentTarget.value });
          }}
        />
        <span>x + </span>
        <input
          value={this.state.bb2}
          onChange={(e) => {
            this.setState({ bb2: e.currentTarget.value });
          }}
        />
        <span>y = </span>
        <input
          value={this.state.zz2}
          onChange={(e) => {
            this.setState({ zz2: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  renderModuloInputIndetermEqua() {
    return (
      <span className='year-select width3'>
        <span>彊母 </span>
        <input
          value={this.state.aa1}
          onChange={(e) => {
            this.setState({ aa1: e.currentTarget.value });
          }}
        />        
        <span>弱母 </span>
        <input
          value={this.state.bb1}
          onChange={(e) => {
            this.setState({ bb1: e.currentTarget.value });
          }}
        />
        <span>日法</span>
        <input
          value={this.state.zz1}
          onChange={(e) => {
            this.setState({ zz1: e.currentTarget.value });
          }}
        />        
      </span>
    );
  }

  renderModuloInputSunzi() {
    return (
      <span className='year-select width5'>
        <p className='note'>求解多組 x ≡ 餘數 (mod 模數) 。依次輸入各組餘數、模數；可用任意非數字隔開；模數需兩兩互質；組數不限</p>
        <input
          value={this.state.sunziIn}
          onChange={(e) => {
          this.setState({ sunziIn: e.currentTarget.value });
          }}
        />
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
        <p className='note'>李銳「有日法求彊弱」法不需要鍵入朔餘，可與秦九韶法配合使用；「累彊弱之數」法可與分數的連分數逼近配合使用</p>
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
        <p className='note'>歲策 = 365 + 斗分/日法，朔策 = 29 + 朔餘/日法。實測冬至 = 干支 + 氣餘/日法，冬至分子 = 干支 * 日法 + 氣餘。天正朔分子= 干支 * 日法 + 朔餘。冬至分子需爲 60 的整數倍</p>
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

  handleConvertIndetermEqua1() {
    try {
      const { xPrint, yPrint } = IndetermEqua1(this.state.aa2, this.state.bb2, this.state.zz2)
      this.setState({ outputIndetermEqua11: xPrint, outputIndetermEqua12: yPrint })
    } catch (e) {
      alert(e.message)
    }
  }
  handleConvertIndetermEqua() {
    try {
      const { xPrint, yPrint, Decompose } = IndetermEqua(this.state.aa1, this.state.bb1, this.state.zz1)
      this.setState({ outputIndetermEqua1: xPrint, outputIndetermEqua2: yPrint,outputIndetermEqua3: Decompose })
    } catch (e) {
      alert(e.message)
    }
  }

  // handleConvertSunzi() {
  //   try {
  //     const { Print } = Sunzi(this.state.b1, this.state.m1, this.state.b2, this.state.m2, this.state.b3, this.state.m3)
  //     this.setState({ outputSunzi: Print })
  //   } catch (e) {
  //     alert(e.message)
  //   }
  // }
  handleConvertSunzi() {
    try {
      const { Print } = Sunzi(this.state.sunziIn)
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
      const { OriginPrint } = OriginModulo(this.state.Denom, this.state.SolarFrac, this.state.OriginConst, this.state.FirstConst)
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
      <div className='ans'>
        <p>{this.state.outputModulo}</p>
      </div>
    )
  }
  renderResultIndetermEqua1() {
    if (!this.state.outputIndetermEqua11) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputIndetermEqua11}</p>
        <p>{this.state.outputIndetermEqua12}</p>
      </div>
    )
  }
  renderResultIndetermEqua() {
    if (!this.state.outputIndetermEqua1) {
      return null
    }
    return (
      <div className='ans'>
        <p></p>
        <div>{this.state.outputIndetermEqua1}</div>
        <div>{this.state.outputIndetermEqua2}</div>
        <p>{this.state.outputIndetermEqua3}</p>
      </div>
    )
  }

  renderResultSunzi() {
    if (!this.state.outputSunzi) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputSunzi}</p>
      </div>
    )
  }

  renderResultContinuedFrac() {
    if (!this.state.outputContinuedFrac) {
      return null
    }
    return (
      <div className='ans'>
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
      <div className='ans'>
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
      <div className='ans renderModuloInputDecompose'>
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
      <div className='ans'>
        <p>{this.state.outputOrigin}</p>
      </div>
    )
  }

  render() {
    return (
      <section className='convert-div'>
        <div>
          <h2>大衍求一術</h2>
          {this.renderModuloInputModulo()}
          <button onClick={this.handleConvertModulo} className='button4-2'>秦九韶再世⌘</button>
          {this.renderResultModulo()}
        </div>
        <div>
          <h2>孫子定理</h2>
          {this.renderModuloInputSunzi()}
          <button onClick={this.handleConvertSunzi} className='button4-7'>老子⋯</button>
          {this.renderResultSunzi()}
        </div>
        <div>
          <h2>二元一次不定方程</h2>
          {this.renderModuloInputIndetermEqua1()}
          <button onClick={this.handleConvertIndetermEqua1} className='button4-8'>●○●○</button>
          {this.renderResultIndetermEqua1()}
        </div>
        <div>
          <h2>調日法</h2>
          <h3>擬秦九韶法</h3>
          {this.renderModuloInputIndetermEqua()}
          <button onClick={this.handleConvertIndetermEqua} className='button4-8'>●○●○</button>
          {this.renderResultIndetermEqua()}
          <h3>淸人三種</h3>
          {this.renderModuloInputDecompose()}
          <button onClick={this.handleConvertDecompose} className='button4-1'>李銳是我∞</button>
          {this.renderResultDecompose()}
        </div>
        <div>
          <h2>連分數逼近</h2>
          <h4>附 最大公因數、最小公倍數</h4>
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
        <div>
          <h2>唐宋演紀</h2>
          {this.renderModuloInputOrigin()}
          <button onClick={this.handleConvertOrigin} className='button4-5'>上元積年</button>
          {this.renderResultOrigin()}
        </div>
      </section>
    )
  }
}