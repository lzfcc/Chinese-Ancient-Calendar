import React from "react";
import { Interpolate1_big } from "../Cal/equa_sn";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Interpolate1N: 2.12345678,
      Interpolate1Raw: '289943,308531,331577,361921,403563,461843',
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>n</span>
        <input className='width4'
          value={this.state.Interpolate1N}
          onChange={e => {
            this.setState({ Interpolate1N: e.currentTarget.value });
          }}
        />
        <p></p>
        <span> 數列</span>
        <input className='width5'
          value={this.state.Interpolate1Raw}
          onChange={e => {
            this.setState({ Interpolate1Raw: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      let arr = this.state.Interpolate1Raw.split(/;|,|，|。|；|｜| /).filter(Boolean)
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Number(arr[i])
      }
      const { Print } = Interpolate1_big(this.state.Interpolate1N, arr)
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
      <div className='ans' style={{ whiteSpace: 'pre-wrap' }}>
        <p>{this.state.output}</p>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>招差術</h3>
        <h4>等間距高次內插</h4>
        {this.input()}
        <button onClick={this.handle} className='button4-5'>朱世傑</button><span className='Deci64'>.64</span>
        {this.result()}
      </div>
    );
  }
}
