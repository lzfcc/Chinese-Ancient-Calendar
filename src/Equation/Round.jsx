import React from "react";
import { Round } from "../Shangshu-calendar/equa_geometry";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handle = this.handle.bind(this)
  }

  input() {
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

  handle() {
    try {
      const { Print } = Round(this.state.RoundR, this.state.RoundB)
      this.setState({ output: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.output}</p>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>會圓術</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-8'>沈括</button>
        {this.result()}
      </div>
    );
  }
}
