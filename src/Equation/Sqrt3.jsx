import React from "react";
import { SqrtC } from "../core/equa_sqrt";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Sqrt3In: 2.357947691,
      Sqrt3Mode: 9,
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <p className='note'>可選次數：2、3、5、7、9</p>
        <input className='width4'
          value={this.state.Sqrt3In}
          onChange={(e) => {
            this.setState({ Sqrt3In: e.currentTarget.value });
          }}
        />
        <span> 次數</span>
        <input className='width1'
          value={this.state.Sqrt3Mode}
          onChange={(e) => {
            this.setState({ Sqrt3Mode: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Print } = SqrtC(this.state.Sqrt3In, this.state.Sqrt3Mode)
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
        <h3>累減開方術</h3>
        <h4>招差開方術　級數開方術　蟬聯法</h4>
        {this.input()}
        <button onClick={this.handle} className='button4-2'>開方</button>
        {this.result()}
      </div>);
  }
}
