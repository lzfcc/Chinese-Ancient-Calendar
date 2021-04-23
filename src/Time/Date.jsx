import React from "react"
import { Date2Jd } from '../Cal/time_jd2date'
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      yy: '',
      mm: '',
      dd: '',
      h: '0',
      m: '0',
      s: '0',
      ms: '000',
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width2">
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

  handle() {
    try {
      const Print = Date2Jd(this.state.yy, this.state.mm, this.state.dd, this.state.h, this.state.m, this.state.s, this.state.ms);
      this.setState({ output: Print });
    } catch (e) {
      alert(e.message);
    }
  }

  result() {
    if (!this.state.output) {
      return null;
    }
    return (
      <div className="ans" style={{ whiteSpace: "pre-wrap" }}>
        <p>{this.state.output}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.input()}
        <button onClick={this.handle} className="button4-8">
          date2JD
        </button>
        {this.result()}
      </div>
    );
  }
}
