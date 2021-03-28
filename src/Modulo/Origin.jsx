import React from "react"
import { OriginModulo } from "../Shangshu-calendar/modulo_origin"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Denom: 16900,
      SolarFrac: 4108,
      OriginConst: "12+7540/16900",
      FirstConst: "10+11671/16900",
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width2">
        <p className="note">
          依次輸入斗分、日法、冬至大小餘、天正經朔大小餘，大餘卽干支序數，無須 -
          1
        </p>
        <span> 斗分</span>
        <input
          value={this.state.SolarFrac}
          onChange={(e) => {
            this.setState({ SolarFrac: e.currentTarget.value });
          }}
        />
        <span>日法</span>
        <input
          value={this.state.Denom}
          onChange={(e) => {
            this.setState({ Denom: e.currentTarget.value });
          }}
        />
        <span> 冬至分子</span>
        <input
          className="width3"
          value={this.state.OriginConst}
          onChange={(e) => {
            this.setState({ OriginConst: e.currentTarget.value });
          }}
        />
        <span> 天正朔分子</span>
        <input
          className="width3"
          value={this.state.FirstConst}
          onChange={(e) => {
            this.setState({ FirstConst: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { OriginPrint } = OriginModulo(
        this.state.Denom,
        this.state.SolarFrac,
        this.state.OriginConst,
        this.state.FirstConst
      );
      this.setState({ outputOrigin: OriginPrint });
    } catch (e) {
      alert(e.message);
    }
  }

  result() {
    if (!this.state.outputOrigin) {
      return null;
    }
    return (
      <div className="ans" style={{ whiteSpace: "pre-wrap" }}>
        <p>{this.state.outputOrigin}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>唐宋演紀</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-5">
          太史曰
        </button>
        {this.result()}
      </div>
    );
  }
}
