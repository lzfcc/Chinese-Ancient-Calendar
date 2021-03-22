import React from 'react'
import { HighEqua1 } from '../src/Shangshu-calendar/equa_high'
import { SqrtA, SqrtC } from '../src/Shangshu-calendar/equa_sqrt'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Sqrt1In:27,
      Sqrt1Mode:3,
      Sqrt3In:2.357947691,
      Sqrt3Mode:9,
      six1:1,
      five1:1,
      four1:-10,
      three1:1,
      two1:1,
      one1:1,
      zero1:1,
      upperRaw:-3,
    }
    this.handleSqrt1 = this.handleSqrt1.bind(this)
    this.handleSqrt3 = this.handleSqrt3.bind(this)
    this.handleEqua1 = this.handleEqua1.bind(this)
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
        <p className='note'></p>
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
      const { upper } = HighEqua1(this.state.six1, this.state.five1, this.state.four1, this.state.three1, this.state.two1, this.state.one1, this.state.zero1, this.state.upperRaw)
      this.setState({ outputEqua1: upper })
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

  render() {
    return (
      <section className='modulo'>
        <div className='modulo'>
          <h2>開方</h2>
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
          <h2>方程</h2>
          <h3>迭代法</h3>
          {this.InputEqua1()}
          <button onClick={this.handleEqua1} className='button4-6'>解</button>
          {this.ResultEqua1()}
        </div>
      </section>
    )
  }
}