import React from "react"
import { IndetermEqua1 } from "../Cal/modulo_origin"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width3">
        <p className="note">
   
        </p>
        <input
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span>x + </span>
        <input
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span>y = </span>
        <input
          value={this.state.z}
          onChange={e => {
            this.setState({ z: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { xPrint, yPrint } = IndetermEqua1(
        this.state.a,
        this.state.b,
        this.state.z
      );
      this.setState({
        output1: xPrint,
        output2: yPrint,
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
        <div>{this.state.output1}</div>
        <div>{this.state.output2}</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>一次同餘式　二元一次不定方程</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-8">
          ●○●○
        </button>
        {this.result()}
      </div>
    );
  }
}
