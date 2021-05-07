import React from "react"
import { ExhauOrigin } from "../Cal/modulo_exhaustion"
export default class Exhau extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Solar: 2427762,
      LunarNumer: 3746,
      Denom: 7060,
      OriginLower: 49.248,
      OriginUpper: 49.252,
      FirstLower: 24.291,
      FirstUpper: 24.299
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width3">
        <span>年 365.</span>
        <input
          value={this.state.Solar}
          onChange={e => {
            this.setState({ Solar: e.currentTarget.value });
          }}
        />
        <span>　月 29+</span>
        <input
          value={this.state.LunarNumer}
          onChange={e => {
            this.setState({ LunarNumer: e.currentTarget.value });
          }}
        />
        <span>/</span>
        <input
          value={this.state.Denom}
          onChange={e => {
            this.setState({ Denom: e.currentTarget.value });
          }}
        />
        <p></p>
        <span>　冬至 ∈ (</span>
        <input
          value={this.state.OriginLower}
          onChange={e => {
            this.setState({ OriginLower: e.currentTarget.value });
          }}
        />
        <span>,</span>
        <input
          value={this.state.OriginUpper}
          onChange={e => {
            this.setState({ OriginUpper: e.currentTarget.value });
          }}
        />
        <span>)　天正經朔 ∈ (</span>
        <input
          value={this.state.FirstLower}
          onChange={e => {
            this.setState({ FirstLower: e.currentTarget.value });
          }}
        />
        <span>,</span>
        <input
          value={this.state.FirstUpper}
          onChange={e => {
            this.setState({ FirstUpper: e.currentTarget.value });
          }}
        />
        <span>)</span>
      </span>
    );
  }

  handle() {
    try {
      const Print = ExhauOrigin(this.state.Solar, this.state.LunarNumer, this.state.Denom, this.state.OriginLower, this.state.OriginUpper, this.state.FirstLower, this.state.FirstUpper);
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
        <h3>第二步、窮舉演紀</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-7">
          暴力
        </button>
        {this.result()}
      </div>
    );
  }
}
