import React from "react";
import { Heron } from "../Cal/equa_geometry";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handle = this.handle.bind(this)
  }

  input() {
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

  handle() {
    try {
      const { Print } = Heron(this.state.HeronA, this.state.HeronB, this.state.HeronC)
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
        <h3>三斜求積術</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-1'>秦九韶</button>
        {this.result()}
      </div>
    );
  }
}
