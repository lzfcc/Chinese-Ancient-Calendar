import React from 'react'
import { Clock } from './Shangshu-calendar/convert_decimal2clock'
import { Jd2Date1, Date2Jd } from '../src/Shangshu-calendar/convert_jd2date'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      jd: '',
      yy: '',
      mm: '',
      dd: '',
      h: '0',
      m: '0',
      s: '0',
      ms: '000',
      outputJd: null,
      outputDate: null,
    }
    this.handleClock = this.handleClock.bind(this)
    this.handleJd = this.handleJd.bind(this)
    this.handleDate = this.handleDate.bind(this)
  }

  
  InputClock() {
    return (
      <span className='year-select'>
        <span>日分 0.</span>
        <input className='width3'
          value={this.state.clock}
          onChange={(e) => {
            this.setState({ clock: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  InputJd() {
    return (
      <span className='year-select'>
        <span>儒略日</span>
        <input className='width4'
          value={this.state.jd}
          onChange={(e) => {
            this.setState({ jd: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  InputDate() {
    return (
      <span className='year-select'>
        <input className='width2'
          value={this.state.yy}
          onChange={(e) => {
            this.setState({ yy: e.currentTarget.value });
          }}
        />
        <span>年</span>
        <input className='width1'
          value={this.state.mm}
          onChange={(e) => {
            this.setState({ mm: e.currentTarget.value });
          }}
        />
        <span>月</span>
        <input className='width1'
          value={this.state.dd}
          onChange={(e) => {
            this.setState({ dd: e.currentTarget.value });
          }}
        />
        <span>日</span>
        <input className='width1'
          value={this.state.h}
          onChange={(e) => {
            this.setState({ h: e.currentTarget.value });
          }}
        />
        <span>h</span>
        <input className='width1'
          value={this.state.m}
          onChange={(e) => {
            this.setState({ m: e.currentTarget.value });
          }}
        />
        <span>m</span>
        <input className='width1'
          value={this.state.s}
          onChange={(e) => {
            this.setState({ s: e.currentTarget.value });
          }}
        />
        <span>s</span>
        <input className='width2'
          value={this.state.ms}
          onChange={(e) => {
            this.setState({ ms: e.currentTarget.value });
          }}
        />
        <span>ms</span>
      </span>
    );
  }

  handleClock() {
    try {
      const { Print } = Clock(this.state.clock)
      this.setState({ outputClock: Print })
    } catch (e) {
      alert(e.message)
    }
  }
  handleJd() {
    try {
      const { Result } = Jd2Date1(this.state.jd)
      this.setState({ outputJd: Result })
    } catch (e) {
      alert(e.message)
    }
  }

  handleDate() {
    try {
      const { Result } = Date2Jd(this.state.yy, this.state.mm, this.state.dd, this.state.h, this.state.m, this.state.s, this.state.ms)
      this.setState({ outputDate: Result })
    } catch (e) {
      alert(e.message)
    }
  }

  
  ResultClock() {
    if (!this.state.outputClock) {
      return null
    }
    return (
      <div className='ans' style={{whiteSpace: 'pre-wrap'}}>
        <p>{this.state.outputClock}</p>
      </div>
    )
  }
  ResultJd() {
    if (!this.state.outputJd) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputJd}</p>
      </div>
    )
  }

  ResultDate() {
    if (!this.state.outputDate) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputDate}</p>
      </div>
    )
  }

  render() {
    return (
      <section className='modulo'>
        <h3>日分 ⇒ 辰刻加時</h3>
        {this.InputClock()}
        <button onClick={this.handleClock} className='button4-1'>decimal2clock</button>
        {this.ResultClock()}
        <h3>儒略日 ⇌ 日期</h3>
        {this.InputJd()}
        <button onClick={this.handleJd} className='button4-8'>JD2date</button>
        {this.ResultJd()}
        <p></p>
        {this.InputDate()}
        <button onClick={this.handleDate} className='button4-8'>date2JD</button>
        {this.ResultDate()}
      </section>
    )
  }
}