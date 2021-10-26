import React from "react";
import { HighEqua1 } from "../Cal/equa_high";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputRaw: '-2,0,3,1',
      upperRaw: 2,
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>系數</span>
        <input className='width4'
          value={this.state.inputRaw}
          onChange={e => {
            this.setState({ inputRaw: e.currentTarget.value });
          }}
        />
        <span> 估根</span>
        <input className='width2'
          value={this.state.upperRaw}
          onChange={e => {
            this.setState({ upperRaw: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      let arr = this.state.inputRaw.split(',').filter(Boolean)
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Number(arr[i])
      }
      const upper = HighEqua1(this.state.upperRaw, arr)
      this.setState({ output: upper })
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
        <h3>二分迭代法</h3>
        <p className='note'>從高次到低次輸入系數，用逗號 , 隔開，如 -2,0,3,1 表示 -2x^3 + 3x + 1 = 0</p>
        {this.input()}
        <button onClick={this.handle} className='button4-6'>解</button><span className='Deci64'>.64</span>
        {this.result()}
      </div>
    );
  }
}
