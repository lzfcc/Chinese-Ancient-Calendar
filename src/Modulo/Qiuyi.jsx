import React from "react"
import { CongruenceModulo } from "../Cal/modulo_qiuyi"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      aRaw: 49,
      bRaw: 26,
    };
    this.handle = this.handle.bind(this)
  }
  
  input() {
    return (
      <span className="year-select width4">
        <p className="note">
          萬法之法，孫子定理、不定方程、調日法、演紀都需要求一術。衍數、定母需互質
          <span className="decimal64">.64</span>
        </p>
        <span>
          泛用<n>用數</n> = 衍數
        </span>
        <input
          value={this.state.aRaw}
          onChange={(e) => {
            this.setState({ aRaw: e.currentTarget.value });
          }}
        />
        <span> × 乘率 ≡ 1 (mod 定母</span>
        <input
          value={this.state.bRaw}
          onChange={(e) => {
            this.setState({ bRaw: e.currentTarget.value });
          }}
        />
        <span>)</span>
      </span>
    );
  }

  handle() {
    try {
      const { Print } = CongruenceModulo(this.state.aRaw, this.state.bRaw);
      this.setState({ output: Print });
    } catch (e) {
      alert(e.message);
    }
  }

  result() {
    if (!this.state.output) {
      return null;
    }
    return (
      <div className="ans">
        <p>{this.state.output}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>大衍求一術</h3>
        <h4>解一次同餘式的核心模塊</h4>
        {this.input()}
        <button onClick={this.handle} className="button4-2">
          秦九韶再世
        </button>
        {this.result()}
      </div>
    );
  }
}
