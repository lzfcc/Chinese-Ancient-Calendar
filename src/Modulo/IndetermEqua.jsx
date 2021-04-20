import React from "react"
import { IndetermEqua } from "../core/modulo_origin"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = { aa1: 49, bb1: 17, zz1: 752 }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width3">
        <span>彊母</span>
        <input
          value={this.state.aa1}
          onChange={(e) => {
            this.setState({ aa1: e.currentTarget.value });
          }}
        />
        <span> 弱母</span>
        <input
          value={this.state.bb1}
          onChange={(e) => {
            this.setState({ bb1: e.currentTarget.value });
          }}
        />
        <span> 日法</span>
        <input
          value={this.state.zz1}
          onChange={(e) => {
            this.setState({ zz1: e.currentTarget.value });
          }}
        />
      </span>
    );
  }
  
  handle() {
    try {
      const { xPrint, yPrint, Decompose } = IndetermEqua(
        this.state.aa1,
        this.state.bb1,
        this.state.zz1
      );
      this.setState({
        output1: xPrint,
        output2: yPrint,
        output3: Decompose,
      });
    } catch (e) {
      alert(e.message);
    }
  }

  result() {
    if (!this.state.output1) {
      return null;
    }
    return (
      <div className="ans">
        <p></p>
        <div>{this.state.output1}</div>
        <div>{this.state.output2}</div>
        <p>{this.state.output3}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>擬秦九韶調日法</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-8">
          解同餘式
        </button>
        {this.result()}
      </div>
    );
  }
}
