import React from "react";
import { Sn1 } from "../core/equa_sn";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handle = this.handle.bind(this)
  }

  input() {
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

  handle() {
    try {
      const { Print } = Sn1(this.state.Sn1a, this.state.Sn1b, this.state.Sn1n)
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
        <h3>隙積術　芻童垛</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>沈括</button>
        {this.result()}
      </div>
    );
  }
}
