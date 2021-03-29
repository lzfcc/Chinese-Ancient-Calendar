import React from "react";
import { SqrtA } from "../Shangshu-calendar/equa_sqrt";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Sqrt1In: 27,
      Sqrt1Mode: 3,
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <p className='note'><v>九章算術</v>開方術。模式 2：開平方；模式 3：開立方</p>
        <input className='width4'
          value={this.state.Sqrt1In}
          onChange={(e) => {
            this.setState({ Sqrt1In: e.currentTarget.value });
          }}
        />
        <span> 次數</span>
        <input className='width1'
          value={this.state.Sqrt1Mode}
          onChange={(e) => {
            this.setState({ Sqrt1Mode: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Print } = SqrtA(this.state.Sqrt1In, this.state.Sqrt1Mode)
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
        <h3>九章算術開方術</h3>
        <h4>劉徽開方術</h4>
        {this.input()}
        <button onClick={this.handle} className='button4-2'>開方</button>
        {this.result()}
      </div>
    );
  }
}
