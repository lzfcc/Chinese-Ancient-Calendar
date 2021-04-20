import React from "react"
import { ExhauConst } from "../core/modulo_exhaustion"
export default class Exhau extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      SolarNumer: 1714,
      Denom: 7060,
      year: 73147137,
      xx: 27.21222,
      range: 0.01,
      lower: 23.578,
      upper: 23.581
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width3">
        <span>年 365+</span>
        <input
          value={this.state.SolarNumer}
          onChange={(e) => {
            this.setState({ SolarNumer: e.currentTarget.value });
          }}
        />
        <span>/</span>
        <input
          value={this.state.Denom}
          onChange={(e) => {
            this.setState({ Denom: e.currentTarget.value });
          }}
        />
        <span> 積年</span>
        <input
          value={this.state.year}
          onChange={(e) => {
            this.setState({ year: e.currentTarget.value });
          }}
        />
        <p></p>
        <span> 參照參數</span>
        <input
          value={this.state.xx}
          onChange={(e) => {
            this.setState({ xx: e.currentTarget.value });
          }}
        />
        <span>±</span>
        <input
          value={this.state.range}
          onChange={(e) => {
            this.setState({ range: e.currentTarget.value });
          }}
        />
        <span> 參數積日 ∈ (</span>
        <input
          value={this.state.lower}
          onChange={(e) => {
            this.setState({ lower: e.currentTarget.value });
          }}
        />
        <span>,</span>
        <input
          value={this.state.upper}
          onChange={(e) => {
            this.setState({ upper: e.currentTarget.value });
          }}
        />
        <span>)</span>
      </span>
    );
  }

  handle() {
    try {
      const Print = ExhauConst(this.state.SolarNumer, this.state.Denom, this.state.year, this.state.xx, this.state.range, this.state.lower, this.state.upper);
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
      <div className="ans" style={{ whiteSpace: "pre-wrap" }}>
        <p>{this.state.output}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>第三步、窮舉參數</h3>
        <p className="note">
          計算恆星年、近點月、交點月等參數。
        </p>
        {this.input()}
        <button onClick={this.handle} className="button4-7">
          暴力
        </button>
        {this.result()}
      </div>
    );
  }
}
