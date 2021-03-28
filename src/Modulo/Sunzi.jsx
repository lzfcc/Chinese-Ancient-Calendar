import React from "react"
import { Sunzi } from "../Shangshu-calendar/modulo_origin"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sunziIn: "60,130;30,120;20,110;30,100;30,60;30,50;5,25;10,20",
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width5">
        <p className="note">
          求解多組 x ≡ r<sub>i</sub> (mod m<sub>i</sub>) ，有解的充要條件是 gcd
          (m<sub>i</sub>, m<sub>i+1</sub>) | abs (r<sub>i</sub> - r
          <sub>i+1</sub>
          )；在孫子定理中，模數需兩兩互質，而秦九韶將不互質的元數變爲互質的定母，進而可以使用孫子定理求解。依次輸入各組餘數
          r、元數 m；分隔符：<code>; , ， 。 ； 空格</code>；組數不限
          <span className="decimal64">.64</span>
        </p>
        {/* 孫子定理有解的充要條件：(m<sub>1</sub>,m<sub>2</sub> | |r<sub>1</sub>-r<sub>2</sub>|) */}
        {/* 1、定母i|元數i，2、定母互質，3、M=定母相乘=元數的最小公倍數 */}
        <input
          value={this.state.sunziIn}
          onChange={(e) => {
            this.setState({ sunziIn: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Print, DingPrint } = Sunzi(this.state.sunziIn);
      this.setState({ output1: Print, output2: DingPrint });
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
        <p>{this.state.output1}</p>
        <p>{this.state.output2}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>大衍總數術</h3>
        <h4>同餘式組　秦九韶推廣之孫子定理</h4>
        {this.input()}
        <button onClick={this.handle} className="button4-7">
          老子
        </button>
        {this.result()}
      </div>
    );
  }
}
