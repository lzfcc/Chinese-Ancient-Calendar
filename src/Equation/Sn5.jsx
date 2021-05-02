import React from "react";
import { Sn5 } from "../Cal/equa_sn";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Sn5N: 4,
      Sn5P: 2,
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <p className='note'>p = 2 時，1+3+6+10+...+n (n+1) /2 = 1/6 n (n+1) (n+2)。通項公式：1/(p+1)! n (n+1) (n+2) ... (n+p)<span className='decimal64'>.64</span></p>
        <span>n</span>
        <input className='width3'
          value={this.state.Sn5N}
          onChange={e => {
            this.setState({ Sn5N: e.currentTarget.value });
          }}
        />
        <span> p</span>
        <input className='width3'
          value={this.state.Sn5P}
          onChange={e => {
            this.setState({ Sn5P: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Print } = Sn5(this.state.Sn5N, this.state.Sn5P)
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
        <h3>三角垛　落一形垛</h3>
        <h4>源於七乘方圖</h4>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>解</button>
        {this.result()}
      </div>
    );
  }
}
