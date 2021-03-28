import React from "react"
import { OriginModulo2 } from "../Shangshu-calendar/modulo_origin"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      SolarFrac3: 1,
      SolarDenom3: 4,
      LunarFrac3: 499,
      Denom3: 940,
      OriginConst3: "34+3/4",
      FirstConst3: "11+410/940",
    }

    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width2">
        <p className="note">
          依次輸入年月參數、冬至大小餘、天正經朔大小餘，大餘卽干支序數，無須 - 1
        </p>
        <span>年 365+</span>
        <input
          value={this.state.SolarFrac3}
          onChange={(e) => {
            this.setState({ SolarFrac3: e.currentTarget.value });
          }}
        />
        <span>/</span>
        <input
          value={this.state.SolarDenom3}
          onChange={(e) => {
            this.setState({ SolarDenom3: e.currentTarget.value });
          }}
        />
        <span> 月 29+</span>
        <input
          value={this.state.LunarFrac3}
          onChange={(e) => {
            this.setState({ LunarFrac3: e.currentTarget.value });
          }}
        />
        <span>/</span>
        <input
          value={this.state.Denom3}
          onChange={(e) => {
            this.setState({ Denom3: e.currentTarget.value });
          }}
        />
        <span> 冬至</span>
        <input
          className="width3"
          value={this.state.OriginConst3}
          onChange={(e) => {
            this.setState({ OriginConst3: e.currentTarget.value });
          }}
        />
        <span> 天正朔</span>
        <input
          className="width3"
          value={this.state.FirstConst3}
          onChange={(e) => {
            this.setState({ FirstConst3: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Print } = OriginModulo2(
        this.state.SolarFrac3,
        this.state.SolarDenom3,
        this.state.LunarFrac3,
        this.state.Denom3,
        this.state.OriginConst3,
        this.state.FirstConst3
      );
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
        <h3>古曆入元</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-5">
          新造
        </button>
        {this.result()}
      </div>
    );
  }
}
