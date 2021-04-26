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
          onChange={(e) => {
            this.setState({ Solar: e.currentTarget.value });
          }}
        />
        <span>　月 29+</span>
        <input
          value={this.state.LunarNumer}
          onChange={(e) => {
            this.setState({ LunarNumer: e.currentTarget.value });
          }}
        />
        <span>/</span>
        <input
          value={this.state.Denom}
          onChange={(e) => {
            this.setState({ Denom: e.currentTarget.value });
          }}
        />
        <p></p>
        <span>　冬至 ∈ (</span>
        <input
          value={this.state.OriginLower}
          onChange={(e) => {
            this.setState({ OriginLower: e.currentTarget.value });
          }}
        />
        <span>,</span>
        <input
          value={this.state.OriginUpper}
          onChange={(e) => {
            this.setState({ OriginUpper: e.currentTarget.value });
          }}
        />
        <span>)　天正經朔 ∈ (</span>
        <input
          value={this.state.FirstLower}
          onChange={(e) => {
            this.setState({ FirstLower: e.currentTarget.value });
          }}
        />
        <span>,</span>
        <input
          value={this.state.FirstUpper}
          onChange={(e) => {
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
        <p className="note">
          暴力窮舉所有符合條件的上元積年。選取一部已知曆法作爲參照，「年」輸入參照曆法化爲小數後的歲實；「月」輸入上一步生成的日法、朔餘<n>（選擇最接近的一箇卽可）</n>；「冬至」輸入參照曆法年前冬至的日分<n>（如乙丑日 0.2518 分，則是 1.2518）</n>；「天正朔」輸入參照曆法年前天正經朔的日分。按照經驗，範圍在 0.02 之內。如計算出多個上元，則縮小範圍繼續計算。如選擇了 1256 年作爲參照，計算出 73147137，則上元爲公元 1256-73147137 年。
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
