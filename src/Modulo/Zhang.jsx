import React from "react"
import { ZhangModulo } from "../Cal/modulo_origin"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      SolarFrac2: 9589,
      SolarDenom2: 39491,
      LunarFrac2: 2090,
      Denom2: 3939,
    }
    this.handle = this.handle.bind(this)
  }
  input() {
    return (
      <span className="year-select width3">
        <p className="note">
          依次輸入斗分、歲實分母、朔餘、日法
          <span className="decimal64">.64</span>
        </p>
        <span>年 365+</span>
        <input
          value={this.state.SolarFrac2}
          onChange={e => {
            this.setState({ SolarFrac2: e.currentTarget.value });
          }}
        />
        <span>/</span>
        <input
          value={this.state.SolarDenom2}
          onChange={e => {
            this.setState({ SolarDenom2: e.currentTarget.value });
          }}
        />
        <span>　月 29+</span>
        <input
          value={this.state.LunarFrac2}
          onChange={e => {
            this.setState({ LunarFrac2: e.currentTarget.value });
          }}
        />
        <span>/</span>
        <input
          value={this.state.Denom2}
          onChange={e => {
            this.setState({ Denom2: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Print } = ZhangModulo(
        this.state.SolarFrac2,
        this.state.SolarDenom2,
        this.state.LunarFrac2,
        this.state.Denom2
      );
      this.setState({ outputZhang: Print });
    } catch (e) {
      alert(e.message);
    }
  }

  result() {
    if (!this.state.outputZhang) {
      return null;
    }
    return (
      <div className="ans" style={{ whiteSpace: "pre-wrap" }}>
        <p>{this.state.outputZhang}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>章蔀紀元法</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-6">
          祖沖之變法
        </button>
        {this.result()}
      </div>
    );
  }
}
