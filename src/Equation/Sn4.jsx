import React from "react";
import { Sn4 } from "../Cal/equa_sn";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Sn4N: 4,
      Sn4P: 2,
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>n</span>
        <input className='width3'
          value={this.state.Sn4N}
          onChange={e => {
            this.setState({ Sn4N: e.currentTarget.value });
          }}
        />
        <span> p</span>
        <input className='width3'
          value={this.state.Sn4P}
          onChange={e => {
            this.setState({ Sn4P: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = Sn4(this.state.Sn4N, this.state.Sn4P)
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
        <h3>四角垛　方垛</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>解</button>
        {this.result()}
      </div>
    );
  }
}
