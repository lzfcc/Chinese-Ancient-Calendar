import React from 'react'
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
    this.handleConvertJd = this.handleConvertJd.bind(this)
    this.handleConvertDate = this.handleConvertDate.bind(this)
  }

  renderConverterInputJd() {
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

  renderConverterInputDate() {
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

  handleConvertJd() {
    try {
      const { Result } = Jd2Date1(this.state.jd)
      this.setState({ outputJd: Result })
    } catch (e) {
      alert(e.message)
    }
  }

  handleConvertDate() {
    try {
      const { Result } = Date2Jd(this.state.yy, this.state.mm, this.state.dd, this.state.h, this.state.m, this.state.s, this.state.ms)
      this.setState({ outputDate: Result })
    } catch (e) {
      alert(e.message)
    }
  }


  renderResultJd() {
    if (!this.state.outputJd) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputJd}</p>
      </div>
    )
  }

  renderResultDate() {
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
      <section className='convert-div'>
        <div className='convert-div'>
          <h2>儒略日 ⇌ 日期</h2>
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