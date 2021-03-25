import React from 'react'
import { CongruenceModulo, ContinuedFrac, GcdLcmGroup, FracLcm1, ContinuedFrac1 } from '../src/Shangshu-calendar/modulo_congruence'
import { DecomposePrimeFactor } from '../src/Shangshu-calendar/modulo_denom'
import { Sunzi, IndetermEqua, IndetermEqua1, ZhangModulo, OriginModulo2, OriginModulo } from '../src/Shangshu-calendar/modulo_origin'
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
      // aa2: '',
      // bb2: '',
      // zz2: '',
      fracA: 399,
      fracB: 752,
      bigNumer: 26,
      bigDenom: 49,
      aRaw: 49,
      bRaw: 26,
      title: '弱率',
      sunziIn: '60,130;30,120;20,110;30,100;30,60;30,50;5,25;10,20', 
      FracLcmIn: '13,145;114,7;14,57;9,13;8,10',
      SolarFrac2: 9589,
      SolarDenom2: 39491,
      LunarFrac2: 2090,
      Denom2: 3939, 
      Denom: 16900,
      SolarFrac: 4108,
      OriginConst: '12+7540/16900',
      FirstConst: '10+11671/16900',
      SolarFrac3: 1, 
      SolarDenom3: 4,
      LunarFrac3: 499,
      Denom3: 940,
      OriginConst3: '34+3/4',
      FirstConst3: '11+410/940',
      // outputModulo: null,
      // outputIndetermEqua: null,
      // outputIndetermEqua1: null,
      // outputSunzi: null,
      // outputDecompse: null,
      // outputContinuedFrac1: null,
      // outputZhang: null,
      // outputOrigin: null,
    }
    this.handleCongruence = this.handleCongruence.bind(this)
    this.handleIndetermEqua = this.handleIndetermEqua.bind(this)
    this.handleIndetermEqua1 = this.handleIndetermEqua1.bind(this)
    this.handleSunzi = this.handleSunzi.bind(this)
    this.handleGcdLcm = this.handleGcdLcm.bind(this)
    this.handleFracLcm = this.handleFracLcm.bind(this)
    this.handleDecompose = this.handleDecompose.bind(this)
    this.handleContinuedFrac = this.handleContinuedFrac.bind(this)
    this.handleContinuedFrac1 = this.handleContinuedFrac1.bind(this)
    this.handleZhang = this.handleZhang.bind(this)
    this.handleOrigin2 = this.handleOrigin2.bind(this)
    this.handleOrigin = this.handleOrigin.bind(this)
  }


  InputCongruence() {
    return (
      <span className='year-select width4'>
        <p className='note'>萬法之法，孫子定理、不定方程、調日法、演紀都需要求一術。衍數、定母需互質<span className='decimal64'>.64</span></p>
        <span>泛用<n>用數</n> = 衍數</span>
        <input
          value={this.state.aRaw}
          onChange={(e) => {
            this.setState({ aRaw: e.currentTarget.value });
          }}
        />
        <span> × 乘率 ≡ 1 (mod 定母</span>
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

  InputIndetermEqua1() {
    return (
      <span className='year-select width3'>
        <p className='note'>ax - by = c 等價於 ax ≡ c (mod b)，有解的充要條件：(a,b)|c，卽 c 能被 a、b的最大公因數整除</p>
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

  InputIndetermEqua() {
    return (
      <span className='year-select width3'>
        <span>彊母</span>
        <input
          value={this.state.aa1}
          onChange={(e) => {
            this.setState({ aa1: e.currentTarget.value });
          }}
        />        
        <span> 弱母</span>
        <input
          value={this.state.bb1}
          onChange={(e) => {
            this.setState({ bb1: e.currentTarget.value });
          }}
        />
        <span> 日法</span>
        <input
          value={this.state.zz1}
          onChange={(e) => {
            this.setState({ zz1: e.currentTarget.value });
          }}
        />        
      </span>
    );
  }

  InputSunzi() {
    return (
      <span className='year-select width5'>
        <p className='note'>求解多組 x ≡ r<sub>i</sub> (mod m<sub>i</sub>) ，有解的充要條件是 gcd (m<sub>i</sub>, m<sub>i+1</sub>) | abs (r<sub>i</sub> - r<sub>i+1</sub>)；在孫子定理中，模數需兩兩互質，而秦九韶將不互質的元數變爲互質的定母，進而可以使用孫子定理求解。依次輸入各組餘數 r、元數 m；分隔符：<code>; , ， 。 ； 空格</code>；組數不限<span className='decimal64'>.64</span></p> 
        {/* 孫子定理有解的充要條件：(m<sub>1</sub>,m<sub>2</sub> | |r<sub>1</sub>-r<sub>2</sub>|) */}
        {/* 1、定母i|元數i，2、定母互質，3、M=定母相乘=元數的最小公倍數 */}
        <input
          value={this.state.sunziIn}
          onChange={(e) => {
          this.setState({ sunziIn: e.currentTarget.value });
          }}
        />
      </span>
    );
  }
  InputContinuedFrac() {
    return (
      <span className='year-select width4'>
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

  InputContinuedFrac1() {
    return (
      <span className='year-select width4'>
        <span>小數</span>
        <input
          value={this.state.Decimal}
          onChange={(e) => {
            this.setState({ Decimal: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  InputDecompose() {
    return (
      <span className='year-select width3'>
        <p className='note'>李銳「有日法求彊弱」法無需朔餘，可與秦九韶法配合使用；「累彊弱之數」法可與分數的連分數逼近配合使用</p>
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
        <span> 日法</span>
        <input
          value={this.state.b}
          onChange={(e) => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span>朔餘</span>
        <input
          value={this.state.a}
          onChange={(e) => {
            this.setState({ a: e.currentTarget.value });
          }}
        />  
      </span>
    );
  }

  InputGcdLcm() {
    return (
      <span className='year-select width5'>
        <p className='note'>求多個整數或小數的最大公因數 gcd、最小公倍數 lcm<span className='decimal64'>.64</span></p>
        <input
          value={this.state.GcdLcmIn}
          onChange={(e) => {
            this.setState({ GcdLcmIn: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  InputFracLcm() {
    return (
      <span className='year-select width5'>
        <p className='note'>求多組分數的最小公倍數 lcm，依次輸入各組分子、分母<n>整數分母用 1 表示。</n><span className='decimal64'>.64</span></p>
        <input
          value={this.state.FracLcmIn}
          onChange={(e) => {
            this.setState({ FracLcmIn: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  InputZhang() {
    return (
      <span className='year-select width3'>
        <p className='note'>依次輸入斗分、歲實分母、朔餘、日法<span className='decimal64'>.64</span></p>
        <span>年 365+</span>
        <input
          value={this.state.SolarFrac2}
          onChange={(e) => {
            this.setState({ SolarFrac2: e.currentTarget.value });
          }}
        />
        <span>/</span>
        <input
          value={this.state.SolarDenom2}
          onChange={(e) => {
            this.setState({ SolarDenom2: e.currentTarget.value });
          }}
        />
        <span>　月 29+</span>
        <input
          value={this.state.LunarFrac2}
          onChange={(e) => {
            this.setState({ LunarFrac2: e.currentTarget.value });
          }}
        />
        <span>/</span>
        <input
          value={this.state.Denom2}
          onChange={(e) => {
            this.setState({ Denom2: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  InputOrigin2() {
    return (
      <span className='year-select width2'>
        <p className='note'>依次輸入年月參數、冬至大小餘、天正經朔大小餘，大餘卽干支序數，無須 - 1</p>
        <span>年 365+</span>
        <input
          value={this.state.SolarFrac3}
          onChange={(e) => {
            this.setState({ SolarFrac3: e.currentTarget.value });
          }}
        />
        <span>/</span>
        <input
          value={this.state.SolarDenom3}
          onChange={(e) => {
            this.setState({ SolarDenom3: e.currentTarget.value });
          }}
        />
        <span> 月 29+</span>
        <input
          value={this.state.LunarFrac3}
          onChange={(e) => {
            this.setState({ LunarFrac3: e.currentTarget.value });
          }}
        />
        <span>/</span>
        <input
          value={this.state.Denom3}
          onChange={(e) => {
            this.setState({ Denom3: e.currentTarget.value });
          }}
        />
        <span> 冬至</span>
        <input className='width3'
          value={this.state.OriginConst3}
          onChange={(e) => {
            this.setState({ OriginConst3: e.currentTarget.value });
          }}
        />
        <span> 天正朔</span>
        <input className='width3'
          value={this.state.FirstConst3}
          onChange={(e) => {
            this.setState({ FirstConst3: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  InputOrigin() {
    return (
      <span className='year-select width2'>
        <p className='note'>依次輸入斗分、日法、冬至大小餘、天正經朔大小餘，大餘卽干支序數，無須 - 1</p>
        <span> 斗分</span>
        <input
          value={this.state.SolarFrac}
          onChange={(e) => {
            this.setState({ SolarFrac: e.currentTarget.value });
          }}
        />
        <span>日法</span>
        <input
          value={this.state.Denom}
          onChange={(e) => {
            this.setState({ Denom: e.currentTarget.value });
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

  handleCongruence() {
    try {
      const { Print } = CongruenceModulo(this.state.aRaw, this.state.bRaw)
      this.setState({ outputModulo: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  handleIndetermEqua1() {
    try {
      const { xPrint, yPrint } = IndetermEqua1(this.state.aa2, this.state.bb2, this.state.zz2)
      this.setState({ outputIndetermEqua11: xPrint, outputIndetermEqua12: yPrint })
    } catch (e) {
      alert(e.message)
    }
  }
  handleIndetermEqua() {
    try {
      const { xPrint, yPrint, Decompose } = IndetermEqua(this.state.aa1, this.state.bb1, this.state.zz1)
      this.setState({ outputIndetermEqua1: xPrint, outputIndetermEqua2: yPrint,outputIndetermEqua3: Decompose })
    } catch (e) {
      alert(e.message)
    }
  }

  handleSunzi() {
    try {
      const { Print, DingPrint } = Sunzi(this.state.sunziIn)
      this.setState({ outputSunzi: Print, outputSunzi1: DingPrint })
    } catch (e) {
      alert(e.message)
    }
  }

  handleGcdLcm() {
    try {
      const { Print } = GcdLcmGroup(this.state.GcdLcmIn)
      this.setState({ outputGcdLcm: Print })
    } catch (e) {
      alert(e.message)
    }
  }
  
  handleFracLcm() {
    try {
      const { lcmFracPrint } = FracLcm1(this.state.FracLcmIn)
      this.setState({ outputFracLcm1: lcmFracPrint })
    } catch (e) {
      alert(e.message)
    }
  }

  handleContinuedFrac() {
    try {
      const { z, zPrint, Result } = ContinuedFrac(this.state.fracA, this.state.fracB)
      this.setState({ outputContinuedFrac1: zPrint, outputContinuedFrac2: Result, outputContinuedFrac3: z })
    } catch (e) {
      alert(e.message)
    }
  }

  handleContinuedFrac1() {
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

  handleDecompose() {
    try {
      const { SmallPrint, Result, Foot } = DecomposePrimeFactor(this.state.a, this.state.b, this.state.bigNumer, this.state.bigDenom)
      this.setState({ outputDecompse: Result, outputDecompse1: SmallPrint, outputDecompse2: Foot })
    } catch (e) {
      alert(e.message)
    }
  }

  handleZhang() {
    try {
      const { Print } = ZhangModulo(this.state.SolarFrac2, this.state.SolarDenom2, this.state.LunarFrac2, this.state.Denom2)
      this.setState({ outputZhang: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  handleOrigin2() {
    try {
      const { Print } = OriginModulo2(this.state.SolarFrac3, this.state.SolarDenom3, this.state.LunarFrac3, this.state.Denom3, this.state.OriginConst3, this.state.FirstConst3)
      this.setState({ outputOrigin2: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  handleOrigin() {
    try {
      const { OriginPrint } = OriginModulo(this.state.Denom, this.state.SolarFrac, this.state.OriginConst, this.state.FirstConst)
      this.setState({ outputOrigin: OriginPrint })
    } catch (e) {
      alert(e.message)
    }
  }

  ResultCongruence() {
    if (!this.state.outputModulo) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputModulo}</p>
      </div>
    )
  }
  ResultIndetermEqua1() {
    if (!this.state.outputIndetermEqua11) {
      return null
    }
    return (
      <div className='ans'>
        <p></p>
        <div>{this.state.outputIndetermEqua11}</div>
        <div>{this.state.outputIndetermEqua12}</div>
        <p></p>
      </div>
    )
  }
  ResultIndetermEqua() {
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

  ResultSunzi() {
    if (!this.state.outputSunzi) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputSunzi}</p>
        <p>{this.state.outputSunzi1}</p>
      </div>
    )
  }

  ResultGcdLcm() {
    if (!this.state.outputGcdLcm) {
      return null
    }
    return (
      <div className='ans' style={{whiteSpace: 'pre-wrap'}}>
        <p>{this.state.outputGcdLcm}</p>
      </div>
    )
  }

  ResultFracLcm() {
    if (!this.state.outputFracLcm1) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputFracLcm1}</p>
      </div>
    )
  }

  ResultContinuedFrac() {
    if (!this.state.outputContinuedFrac1) {
      return null
    }
    return (
      <div className='ans' style={{whiteSpace: 'pre-wrap'}}>
        <p>{this.state.outputContinuedFrac1}</p>
        <p>{this.state.outputContinuedFrac2}</p>
      </div>
    )
  }

  ResultContinuedFrac1() {
    if (!this.state.outputContinuedFrac13) {
      return null
    }
    return (
      <div className='ans' style={{whiteSpace: 'pre-wrap'}}>
        <p>{this.state.outputContinuedFrac11}</p>
        <p>{this.state.outputContinuedFrac12}</p>
      </div>
    )
  }

  ResultDecompose() {
    if (!this.state.outputDecompse) {
      return null
    }
    return (
      <div className='ans InputDecompose' style={{whiteSpace: 'pre-wrap'}}>
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

  ResultZhang() {
    if (!this.state.outputZhang) {
      return null
    }
    return (
      <div className='ans' style={{whiteSpace: 'pre-wrap'}}>
        <p>{this.state.outputZhang}</p>
      </div>
    )
  }

  ResultOrigin2() {
    if (!this.state.outputOrigin2) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputOrigin2}</p>
      </div>
    )
  }

  ResultOrigin() {
    if (!this.state.outputOrigin) {
      return null
    }
    return (
      <div className='ans' style={{whiteSpace: 'pre-wrap'}}>
        <p>{this.state.outputOrigin}</p>
      </div>
    )
  }

  render() {
    return (
      <section className='modulo'>
        <h2>大衍之什</h2>
          <h3>大衍求一術</h3>
          <h4>解一次同餘式的核心模塊</h4>
          {this.InputCongruence()}
          <button onClick={this.handleCongruence} className='button4-2'>秦九韶再世</button>
          {this.ResultCongruence()}
          <h3>一次同餘式　二元一次不定方程</h3>
          {this.InputIndetermEqua1()}
          <button onClick={this.handleIndetermEqua1} className='button4-8'>●○●○</button>
          {this.ResultIndetermEqua1()}          
          <h3>大衍總數術</h3>
          <h4>同餘式組　秦九韶推廣之孫子定理</h4>
          {this.InputSunzi()}
          <button onClick={this.handleSunzi} className='button4-7'>老子</button>
          {this.ResultSunzi()}
        <h2>調日法之什</h2>
          <h3>擬秦九韶調日法</h3>
          {this.InputIndetermEqua()}
          <button onClick={this.handleIndetermEqua} className='button4-8'>解同餘式</button>
          {this.ResultIndetermEqua()}
          <h3>淸人調日法三種</h3>
          <h4>有日法求彊弱　累彊弱之數　顧觀光-陳久金</h4>
          {this.InputDecompose()}
          <button onClick={this.handleDecompose} className='button4-1'>李銳是我</button>
          {this.ResultDecompose()}
          <h3>連分數　漸進分數</h3>
          {this.InputContinuedFrac()}
          <span className='decimal64'>.64</span>
          <button onClick={this.handleContinuedFrac} className='button4-3'>快快快</button>          
          {(this.state.outputContinuedFrac3 || []).length > 0 ?
            <MathJax rawLatex={this.convertLatex(this.state.outputContinuedFrac3)} /> : null
          }
          {this.ResultContinuedFrac()}
          <p></p>
          {this.InputContinuedFrac1()}
          <button onClick={this.handleContinuedFrac1} className='button4-3'>衝衝衝</button>
          {(this.state.outputContinuedFrac13 || []).length > 0 ?
            <MathJax rawLatex={this.convertLatex(this.state.outputContinuedFrac13)} /> : null
          }
          {this.ResultContinuedFrac1()}
        <h2>章蔀之什</h2>
          <h3>整數小數最大公因數、最小公倍數</h3>
          {this.InputGcdLcm()}
          <button onClick={this.handleGcdLcm} className='button4-6'>try</button>
          {this.ResultGcdLcm()}
          <h3>分數最小公倍數</h3>
          {this.InputFracLcm()}
          <button onClick={this.handleFracLcm} className='button4-6'>try</button>
          {this.ResultFracLcm()}
          <h3>章蔀紀元法</h3>
          {this.InputZhang()}
          <button onClick={this.handleZhang} className='button4-6'>祖沖之變法</button>
          {this.ResultZhang()}
        <h2>上元演紀之什</h2>
          <h3>古曆入元</h3>
          {this.InputOrigin2()}
          <button onClick={this.handleOrigin2} className='button4-5'>新造</button>
          {this.ResultOrigin2()}
          <h3>唐宋演紀</h3>
          {this.InputOrigin()}
          <button onClick={this.handleOrigin} className='button4-5'>太史曰</button>
          {this.ResultOrigin()}
      </section>
    )
  }
}