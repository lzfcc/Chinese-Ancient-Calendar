import React from 'react'
import { HighEqua1 } from '../src/Shangshu-calendar/equa_high'
import { SqrtA, SqrtC } from '../src/Shangshu-calendar/equa_sqrt'
import { Sn1, Sn2, Sn5, Interpolate1, Interpolate2 } from '../src/Shangshu-calendar/equa_sn'
import { Round, Heron } from '../src/Shangshu-calendar/equa_geometry'
export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Sqrt1In: 27,
      Sqrt1Mode: 3,
      Sqrt3In: 2.357947691,
      Sqrt3Mode: 9,
      nine1: 0,
      eight1: 0,
      seven1: 0,
      six1: 0,
      five1: 0,
      four1: 0,
      three1: -2,
      two1: 1,
      one1: 1,
      zero1: 1,
      upperRaw: 2,
      Sn5N: 4,
      Sn5P: 2,
      Sn2N: 4,
      Sn2P: 2,
      Interpolate1N: 2.12345678,
      Interpolate1P: 5,
      Interpolate1Raw: '289943,308531,331577,361921,403563,461843',
      Interpolate2N: 1.12345678,
      Interpolate2Raw: '18588,4458,2840,1160,180',
      Interpolate20: 289943,
    }
    this.handleSqrt1 = this.handleSqrt1.bind(this)
    this.handleSqrt3 = this.handleSqrt3.bind(this)
    this.handleEqua1 = this.handleEqua1.bind(this)
    this.handleSn1 = this.handleSn1.bind(this)
    this.handleSn2 = this.handleSn2.bind(this)
    this.handleSn5 = this.handleSn5.bind(this)
    this.handleInterpolate1 = this.handleInterpolate1.bind(this)
    this.handleInterpolate2 = this.handleInterpolate2.bind(this)
    this.handleRound = this.handleRound.bind(this)
    this.handleHeron = this.handleHeron.bind(this)
  }
  InputSqrt1() {
    return (
      <span className='year-select'>
        <p className='note'><v>九章算術</v>開方術。模式 2：開平方；模式 3：開立方</p>
        <input className='width4'
          value={this.state.Sqrt1In}
          onChange={(e) => {
            this.setState({ Sqrt1In: e.currentTarget.value });
          }}
        />
        <span> 次數</span>
        <input className='width1'
          value={this.state.Sqrt1Mode}
          onChange={(e) => {
            this.setState({ Sqrt1Mode: e.currentTarget.value });
          }}
        />
      </span>
    );
  }
  InputSqrt3() {
    return (
      <span className='year-select'>
        <p className='note'>可選次數：2、3、5、7、9</p>
        <input className='width4'
          value={this.state.Sqrt3In}
          onChange={(e) => {
            this.setState({ Sqrt3In: e.currentTarget.value });
          }}
        />
        <span> 次數</span>
        <input className='width1'
          value={this.state.Sqrt3Mode}
          onChange={(e) => {
            this.setState({ Sqrt3Mode: e.currentTarget.value });
          }}
        />
      </span>
    );
  }
  // 牛頓迭代法
  InputEqua1() {
    return (
      <span className='year-select'>
        <p className='note'>需要預先估計根所在的範圍，正負皆可。也可用來高次開方。<span className='decimal64'>.64</span></p>
        <input className='width2'
          value={this.state.nine1}
          onChange={(e) => {
            this.setState({ nine1: e.currentTarget.value });
          }}
        />
        <span>x<sup>9</sup> + </span>
        <input className='width2'
          value={this.state.eight1}
          onChange={(e) => {
            this.setState({ eight1: e.currentTarget.value });
          }}
        />
        <span>x<sup>8</sup> + </span>
        <input className='width2'
          value={this.state.seven1}
          onChange={(e) => {
            this.setState({ seven1: e.currentTarget.value });
          }}
        />
        <span>x<sup>7</sup> + </span>
        <input className='width2'
          value={this.state.six1}
          onChange={(e) => {
            this.setState({ six1: e.currentTarget.value });
          }}
        />
        <span>x<sup>6</sup> + </span>
        <input className='width2'
          value={this.state.five1}
          onChange={(e) => {
            this.setState({ five1: e.currentTarget.value });
          }}
        />
        <span>x<sup>5</sup> + </span>
        <input className='width2'
          value={this.state.four1}
          onChange={(e) => {
            this.setState({ four1: e.currentTarget.value });
          }}
        />
        <span>x<sup>4</sup> + </span>
        <input className='width2'
          value={this.state.three1}
          onChange={(e) => {
            this.setState({ three1: e.currentTarget.value });
          }}
        />
        <span>x<sup>3</sup> + </span>
        <input className='width2'
          value={this.state.two1}
          onChange={(e) => {
            this.setState({ two1: e.currentTarget.value });
          }}
        />
        <span>x<sup>2</sup> + </span>
        <input className='width2'
          value={this.state.one1}
          onChange={(e) => {
            this.setState({ one1: e.currentTarget.value });
          }}
        />
        <span>x + </span>
        <input className='width2'
          value={this.state.zero1}
          onChange={(e) => {
            this.setState({ zero1: e.currentTarget.value });
          }}
        />
        <span> = 0</span>
        <p></p>
        <span> 估根</span>
        <input className='width2'
          value={this.state.upperRaw}
          onChange={(e) => {
            this.setState({ upperRaw: e.currentTarget.value });
          }}
        />
      </span>
    );
  }
  InputSn1() {
    return (
      <span className='year-select'>
        <p className='note'>「芻童」卽長方稜臺。上有寬 a 個、長 b 個，下有寬 c 個、長 d 個，共 n 層，每層長寬各多 1 個。<span className='decimal64'>.64</span></p>
        <span>頂層寬</span>
        <input className='width3'
          value={this.state.Sn1a}
          onChange={(e) => {
            this.setState({ Sn1a: e.currentTarget.value });
          }}
        />
        <span> 頂層長</span>
        <input className='width3'
          value={this.state.Sn1b}
          onChange={(e) => {
            this.setState({ Sn1b: e.currentTarget.value });
          }}
        />
        <span> 層數</span>
        <input className='width3'
          value={this.state.Sn1n}
          onChange={(e) => {
            this.setState({ Sn1n: e.currentTarget.value });
          }}
        />
      </span>
    );
  }
  InputSn2() {
    return (
      <span className='year-select'>
        <p className='note'>卽自然數平方級數求和。1+4+9+...+n^2 = 1/3 n (n+1) (n+1/2)=1/6 n (n+1) (2n+1)<span className='decimal64'>.64</span></p>
        <span>n</span>
        <input className='width3'
          value={this.state.Sn2N}
          onChange={(e) => {
            this.setState({ Sn2N: e.currentTarget.value });
          }}
        />
        <span> p</span>
        <input className='width3'
          value={this.state.Sn2P}
          onChange={(e) => {
            this.setState({ Sn2P: e.currentTarget.value });
          }}
        />
      </span>
    );
  }
  InputSn5() {
    return (
      <span className='year-select'>
        <p className='note'>p = 2 時，1+3+6+10+...+n (n+1) /2 = 1/6 n (n+1) (n+2)。通項公式：1/(p+1)! n (n+1) (n+2) ... (n+p)<span className='decimal64'>.64</span></p>
        <span>n</span>
        <input className='width3'
          value={this.state.Sn5N}
          onChange={(e) => {
            this.setState({ Sn5N: e.currentTarget.value });
          }}
        />
        <span> p</span>
        <input className='width3'
          value={this.state.Sn5P}
          onChange={(e) => {
            this.setState({ Sn5P: e.currentTarget.value });
          }}
        />
      </span>
    );
  }
  InputInterpolate1() {
    return (
      <span className='year-select'>
        <p className='note'>在「數列」框中輸入一組離散値，數量 = 次數 + 1，以第一個數爲起算點。「次數」爲進行幾次內插，卽幾次多項式。n 爲所求的數，第一個離散値的 n 爲 1。內插公式的一般形式：f(x<sub>0</sub>+x) = f(x<sub>0</sub>) + Δ<sup>1</sup>x + Δ<sup>2</sup> 1/2! x (x-1) +...+ Δ<sup>p</sup> 1/p! x (x-1) ... (x-p+1)。初始値爲<v>大衍曆</v>晷影五次差分表<span className='decimal64'>.64</span></p>
        <span>n</span>
        <input className='width4'
          value={this.state.Interpolate1N}
          onChange={(e) => {
            this.setState({ Interpolate1N: e.currentTarget.value });
          }}
        />
        <span> 次數</span>
        <input className='width1'
          value={this.state.Interpolate1P}
          onChange={(e) => {
            this.setState({ Interpolate1P: e.currentTarget.value });
          }}
        />
        <p></p>
        <span> 數列</span>
        <input className='width5'
          value={this.state.Interpolate1Raw}
          onChange={(e) => {
            this.setState({ Interpolate1Raw: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  InputInterpolate2() {
    return (
      <span className='year-select'>
        <p></p>
        <p className='note'>已知差分<n>由低次到高次排列</n>，求 y(n)。次數爲差分的個數。第一個數的 n 是 0，上面的是 1。<span className='decimal64'>.64</span></p>
        <span>n</span>
        <input className='width4'
          value={this.state.Interpolate2N}
          onChange={(e) => {
            this.setState({ Interpolate2N: e.currentTarget.value });
          }}
        />
        <span> f<sub>0</sub></span>
        <input className='width4'
          value={this.state.Interpolate20}
          onChange={(e) => {
            this.setState({ Interpolate20: e.currentTarget.value });
          }}
        />
        <p></p>
        <span> Δ</span>
        <input className='width5'
          value={this.state.Interpolate2Raw}
          onChange={(e) => {
            this.setState({ Interpolate2Raw: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  InputRound() {
    return (
      <span className='year-select'>
        <p className='note'>輸入圓的半徑 r、弓形的高「矢」b。<span className='decimal64'>.64</span></p>
        <span>半徑</span>
        <input className='width3'
          value={this.state.RoundR}
          onChange={(e) => {
            this.setState({ RoundR: e.currentTarget.value });
          }}
        />
        <span> 矢</span>
        <input className='width3'
          value={this.state.RoundB}
          onChange={(e) => {
            this.setState({ RoundB: e.currentTarget.value });
          }}
        />
      </span>
    );
  }
  InputHeron() {
    return (
      <span className='year-select'>
        <p className='note'>輸入三角形三邊邊長，求面積。<span className='decimal64'>.64</span></p>
        <span>a</span>
        <input className='width3'
          value={this.state.HeronA}
          onChange={(e) => {
            this.setState({ HeronA: e.currentTarget.value });
          }}
        />
        <span> b</span>
        <input className='width3'
          value={this.state.HeronB}
          onChange={(e) => {
            this.setState({ HeronB: e.currentTarget.value });
          }}
        />
        <span> c</span>
        <input className='width3'
          value={this.state.HeronC}
          onChange={(e) => {
            this.setState({ HeronC: e.currentTarget.value });
          }}
        />
      </span>
    );
  }
  handleSqrt1() {
    try {
      const { Print } = SqrtA(this.state.Sqrt1In, this.state.Sqrt1Mode)
      this.setState({ outputSqrt1: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  handleSqrt3() {
    try {
      const { Print } = SqrtC(this.state.Sqrt3In, this.state.Sqrt3Mode)
      this.setState({ outputSqrt3: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  handleEqua1() {
    try {
      const { upper } = HighEqua1(this.state.nine1, this.state.eight1, this.state.seven1, this.state.six1, this.state.five1, this.state.four1, this.state.three1, this.state.two1, this.state.one1, this.state.zero1, this.state.upperRaw)
      this.setState({ outputEqua1: upper })
    } catch (e) {
      alert(e.message)
    }
  }
  handleSn1() {
    try {
      const { Print } = Sn1(this.state.Sn1a, this.state.Sn1b, this.state.Sn1n)
      this.setState({ outputSn1: Print })
    } catch (e) {
      alert(e.message)
    }
  }
  handleSn2() {
    try {
      const { Print } = Sn2(this.state.Sn2N, this.state.Sn2P)
      this.setState({ outputSn2: Print })
    } catch (e) {
      alert(e.message)
    }
  }
  handleSn5() {
    try {
      const { Print } = Sn5(this.state.Sn5N, this.state.Sn5P)
      this.setState({ outputSn5: Print })
    } catch (e) {
      alert(e.message)
    }
  }
  handleInterpolate1() {
    try {
      const { Print } = Interpolate1(this.state.Interpolate1N, this.state.Interpolate1P, this.state.Interpolate1Raw)
      this.setState({ outputInterpolate1: Print })
    } catch (e) {
      alert(e.message)
    }
  }
  handleInterpolate2() {
    try {
      const { yPrint } = Interpolate2(this.state.Interpolate2N, this.state.Interpolate20, this.state.Interpolate2Raw)
      this.setState({ outputInterpolate2: yPrint })
    } catch (e) {
      alert(e.message)
    }
  }
  handleRound() {
    try {
      const { Print } = Round(this.state.RoundR, this.state.RoundB)
      this.setState({ outputRound: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  handleHeron() {
    try {
      const { Print } = Heron(this.state.HeronA, this.state.HeronB, this.state.HeronC)
      this.setState({ outputHeron: Print })
    } catch (e) {
      alert(e.message)
    }
  }


  ResultSqrt1() {
    if (!this.state.outputSqrt1) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputSqrt1}</p>
      </div>
    )
  }

  ResultSqrt3() {
    if (!this.state.outputSqrt3) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputSqrt3}</p>
      </div>
    )
  }

  ResultEqua1() {
    if (!this.state.outputEqua1) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputEqua1}</p>
      </div>
    )
  }
  ResultSn1() {
    if (!this.state.outputSn1) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputSn1}</p>
      </div>
    )
  }
  ResultSn2() {
    if (!this.state.outputSn2) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputSn2}</p>
      </div>
    )
  }
  ResultSn5() {
    if (!this.state.outputSn5) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputSn5}</p>
      </div>
    )
  }
  ResultInterpolate1() {
    if (!this.state.outputInterpolate1) {
      return null
    }
    return (
      <div className='ans' style={{whiteSpace: 'pre-wrap'}}>
        <p>{this.state.outputInterpolate1}</p>
      </div>
    )
  }
  ResultInterpolate2() {
    if (!this.state.outputInterpolate2) {
      return null
    }
    return (
      <div className='ans' style={{whiteSpace: 'pre-wrap'}}>
        <p>{this.state.outputInterpolate2}</p>
      </div>
    )
  }
  ResultRound() {
    if (!this.state.outputRound) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputRound}</p>
      </div>
    )
  }
  ResultHeron() {
    if (!this.state.outputHeron) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputHeron}</p>
      </div>
    )
  }

  render() {
    return (
      <section className='modulo'>
        <div className='modulo'>
          <h2>開方之什</h2>
          <h3>九章算術開方術</h3>
          <h4>劉徽開方術</h4>
          {this.InputSqrt1()}
          <button onClick={this.handleSqrt1} className='button4-2'>開方</button>
          {this.ResultSqrt1()}
          <h3>累減開方術</h3>
          <h4>招差開方術　級數開方術　蟬聯法</h4>
          {this.InputSqrt3()}
          <button onClick={this.handleSqrt3} className='button4-2'>開方</button>
          {this.ResultSqrt3()}
          <h2>方程之什</h2>
          <h3>牛頓迭代法</h3>
          {this.InputEqua1()}
          <button onClick={this.handleEqua1} className='button4-6'>解</button>
          {this.ResultEqua1()}
          <h2>垛積之什</h2>
          <h3>隙積術　芻童垛</h3>
          {this.InputSn1()}
          <button onClick={this.handleSn1} className='button4-3'>解</button>
          {this.ResultSn1()}
          <h3>四角垛　方垛</h3>
          {this.InputSn2()}
          <button onClick={this.handleSn2} className='button4-3'>解</button>
          {this.ResultSn2()}
          <h3>三角垛　落一形垛</h3>
          <h4>源於七乘方圖</h4>
          {this.InputSn5()}
          <button onClick={this.handleSn5} className='button4-3'>解</button>
          {this.ResultSn5()}
          <h2>招差之什</h2>
          <h3>招差術　如像招數</h3>
          <h4>高次內插</h4>
          {this.InputInterpolate1()}
          <button onClick={this.handleInterpolate1} className='button4-5'>朱世傑</button>
          {this.ResultInterpolate1()}
          {this.InputInterpolate2()}
          <button onClick={this.handleInterpolate2} className='button4-5'>朱世傑</button>
          {this.ResultInterpolate2()}
          <h2>幾何之什</h2>
          <h3>會圓術</h3>
          {this.InputRound()}
          <button onClick={this.handleRound} className='button4-8'>沈括</button>
          {this.ResultRound()}
          <h3>弧矢割圓術</h3>
          <p className='note'>《授時曆》黃赤轉換，見「轉換」標籤。</p>
          <h3>三斜求積術</h3>
          {this.InputHeron()}
          <button onClick={this.handleHeron} className='button4-1'>秦九韶</button>
          {this.ResultHeron()}
        </div>
      </section>
    )
  }
}