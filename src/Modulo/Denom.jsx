import React from "react"
import { DecomposePrimeFactor } from "../Cal/modulo_denom"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = { a: 399, b: 752, bigNumer: 26, bigDenom: 49, title: "弱率" }
    this.handle = this.handle.bind(this)
  }
  
  input() {
    return (
      <span className="year-select width3">
        <p className="note">
          李銳「有日法求彊弱」法無需朔餘，可與秦九韶法配合使用；「累彊弱之數」法可與分數的連分數逼近配合使用
        </p>
        <span> 彊子</span>
        <input
          value={this.state.bigNumer}
          onChange={(e) => {
            this.setState({ bigNumer: e.currentTarget.value });
          }}
        />
        <span> 彊母</span>
        <input
          value={this.state.bigDenom}
          onChange={(e) => {
            this.setState({ bigDenom: e.currentTarget.value });
          }}
        />
        <span> 日法</span>
        <input
          value={this.state.b}
          onChange={(e) => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span>朔餘</span>
        <input
          value={this.state.a}
          onChange={(e) => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { SmallPrint, Result, Foot } = DecomposePrimeFactor(
        this.state.a,
        this.state.b,
        this.state.bigNumer,
        this.state.bigDenom
      );
      this.setState({ output1: Result, output2: SmallPrint, output3: Foot });
    } catch (e) {
      alert(e.message);
    }
  }

  result() {
    if (!this.state.output1) {
      return null;
    }
    return (
      <div className="ans InputDecompose" style={{ whiteSpace: "pre-wrap" }}>
        <p>{this.state.output2}</p>
        <table>
          <tr>
            <th></th>
            <th>朔餘</th>
            <th>日法</th>
            <th>約餘</th>
          </tr>
          {(this.state.output1 || []).map((row) => {
            return (
              <tr>
                <td className="RowTitle">{row.title}</td>
                {row.data.map((d) => {
                  return <td>{d}</td>;
                })}
              </tr>
            );
          })}
        </table>
        <p>{this.state.output3}</p>
      </div>
    );
  }
  render() {
    return (
      <div>
        <h3>淸人調日法三種</h3>
        <h4>有日法求彊弱　累彊弱之數　顧觀光-陳久金</h4>
        {this.input()}
        <button onClick={this.handle} className="button4-1">
          李銳是我
        </button>
        {this.result()}
      </div>
    );
  }
}
