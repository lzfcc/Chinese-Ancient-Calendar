import React from "react";
import { MeasureWinsols } from "../Cal/equa_sn";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initial: '14,7.94855,21,7.9541,22,7.9455',
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span> 日數,影長</span>
        <input className='width5'
          value={this.state.initial}
          onChange={e => {
            this.setState({ initial: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = MeasureWinsols(this.state.initial)
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
        <h3>晷長 ⇒ 冬至時刻</h3>
        <h4>不等間距二次內插求極大值</h4>
        {this.input()}
        <button onClick={this.handle} className='button4-6'>不是線性插值</button><span className='Deci64'>.64</span>
        {this.result()}
      </div>
    );
  }
}
