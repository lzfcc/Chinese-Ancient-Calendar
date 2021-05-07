import React from "react";
import { Interpolate2_big } from "../Cal/equa_sn";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Interpolate2N: 1.12345678,
      Interpolate2Raw: '18588,4458,2840,1160,180',
      Interpolate20: 289943,
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>n</span>
        <input className='width4'
          value={this.state.Interpolate2N}
          onChange={e => {
            this.setState({ Interpolate2N: e.currentTarget.value });
          }}
        />
        <span> f<sub>0</sub></span>
        <input className='width4'
          value={this.state.Interpolate20}
          onChange={e => {
            this.setState({ Interpolate20: e.currentTarget.value });
          }}
        />
        <p></p>
        <span> Δ</span>
        <input className='width5'
          value={this.state.Interpolate2Raw}
          onChange={e => {
            this.setState({ Interpolate2Raw: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { yPrint } = Interpolate2_big(this.state.Interpolate2N, this.state.Interpolate20, this.state.Interpolate2Raw)
      this.setState({ output: yPrint })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output) {
      return null
    }
    return (
      <div className='ans' style={{ whiteSpace: 'pre-wrap' }}>
        <p>{this.state.output}</p>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.input()}
        <button onClick={this.handle} className='button4-5'>朱世傑</button><span className='decimal64'>.64</span>
        {this.result()}
      </div>
    );
  }
}
