import React from "react";
import { polyfit } from "../Cal/equa_sn";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 3,
      Obj: `[{ "x": 1, "y": 8 },\n { "x": 2, "y": 27 },\n { "x": 3, "y": 64 },\n { "x": 4, "y": 125 }]`
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <textarea className='width6'
          value={this.state.Obj}
          onChange={e => {
            this.setState({ Obj: e.currentTarget.value });
          }}
        />
        <br />
        <span>次數</span>
        <input className='width1'
          value={this.state.n}
          onChange={e => {
            this.setState({ n: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = polyfit(this.state.n, this.state.Obj)
      this.setState({ Print })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.Print) {
      return null
    }
    return (
      <div className='ans' style={{ whiteSpace: 'pre-wrap' }}>
        <p>{this.state.Print}</p>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>多項式擬合</h3>
        {this.input()}<button onClick={this.handle} className='button4-6'>click</button><span className='Deci64'>mathjs</span>
        {this.result()}
      </div>
    );
  }
}
