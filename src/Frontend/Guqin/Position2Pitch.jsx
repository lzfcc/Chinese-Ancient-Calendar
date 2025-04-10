import React from 'react'
import SingleSelectMenu from "../SingleSelectMenu";
import { TuningOptions, GenList, OutList } from "Cal/parameter/constants.mjs";
import { Position2Pitch } from '../../Cal/guqin/guqin.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: `9.46,3;9,4;s,2;9.46,3;l,10.8;zh;s,4;14,1;s,2;10.8,3;l,9;l,10.8;l,9;l,7.9;s,7;10,2;l,14;s,4;10.8,3;9,4;5;6;6;10,5;l,9;l,10;l,9;l,7.6;7.9,7;l,9;s,4;9,6;9,5;l,7.6;l,9;4;10,2;10.8,3;9,4;l,7.9;l,7;9,4;l,10.8;14,4;3;4;3;10.8,3;l,9;4;3;l,7.9;l,9;2;s,4;2;14,1;10.8,1;l,9;2;l,7.9;l,9;10,2;s,7;10,2;l,14;s,4;9.46,3;10,4;s,7;9,4;s,7;9,4;10,4;10,3;4;3;3;l,9;l,10;l,9;s,7;2;9,4;s,7;8.6,5;9,6;6;8.6,7;7;2;7;l,7.6;l,7;7;7;2;7;l,6.2;l,5.6;7;7;l,4.8;l,5.6;l,6.2;6.4,6;7,6;l,7.4;l,7;7;s,6;9,4;l,7.6;9,7;7.9,6;l,7;7.6,5;l,8.6;9,4;l,7.6;7;l,9;s,7;4;9,6;10,3;l,9;l,7.9;l,9;9,3;l,7.9;s,3;4;2;12.1,2;l,10;l,9;s,5;7.6,2;l,7;s,7;2;4;9,6`,
      mode: '1',
      temp: '5',
      f: '432',
      outmode: '2',
      isStrict: '0'
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <textarea
          className='width6'
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <br />
        <span>弦法
          <SingleSelectMenu
            Calendars={TuningOptions}
            onSelect={(selected) => {
              this.setState({ mode: selected });
            }}
            selected={this.state.mode}
          />
        </span>
        <span>律制
          <SingleSelectMenu
            Calendars={GenList}
            onSelect={(selected) => {
              this.setState({ temp: selected });
            }}
            selected={this.state.temp}
          />
        </span>
        <span> 宮弦</span>
        <input
          className='width1'
          value={this.state.GongString}
          onChange={e => {
            this.setState({ GongString: e.currentTarget.value });
          }}
        />
        <span> 徵弦</span>
        <input
          className='width1'
          value={this.state.ZhiString}
          onChange={e => {
            this.setState({ ZhiString: e.currentTarget.value });
          }}
        />
        <span> 基準頻率</span>
        <input
          className='width2'
          value={this.state.f}
          onChange={e => {
            this.setState({ f: e.currentTarget.value });
          }}
        />
        <span> 輸出
          <SingleSelectMenu
            Calendars={OutList}
            onSelect={(selected) => {
              this.setState({ outmode: selected });
            }}
            selected={this.state.outmode}
          />
        </span>
        <span className="checkbox-group">
          <label className={`checkbox-label ${this.state.isStrict === "1" ? 'active' : ''}`}>
            <input
              type="checkbox"
              className='hidden-input'
              checked={this.state.isStrict === "1"}
              onChange={e => this.setState({ isStrict: e.target.checked ? "1" : "0" })}
            />
            <span className="custom-checkbox">嚴格</span>
          </label>
        </span>
      </span>
    );
  }

  handle() {
    try {
      const Print = Position2Pitch(this.state.a, this.state.mode, this.state.temp, this.state.GongString, this.state.ZhiString, this.state.f, this.state.outmode, this.state.isStrict)
      this.setState({ output: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output) {
      return null
    }
    return (
      <div className='ans' style={{ whiteSpace: "pre-wrap" }}>
        <ul className='tl'>
          <li>【格式】「類型，徽位，弦;」。s 散音 「s,6;」。f 泛音；長段泛音用 「[]」 包裹，如 「[7,6;9,3];」 = 「f,7,6;f,9,3;」。l 連音（上滑下滑）「7,7;l,7」，zh 撞，「7,7;zh;」。qi 起，「7,7;qi;」 空弦帶起；「7,7;qi,7.6;」 七徽六搯起。shang 上，xia 下 「9,1;shang」，（fenkai 分開。suo3 璅三聲，suo7 璅七聲，suo9 璅九聲 「s,7;suo7;」dayuan 打圓。）</li>
          <li> 【宮弦】以幾弦爲宮音。大多數曲子都是以三弦爲宮的正調【徵弦】一些調沒有宮音散音，就填徵弦。如果填了徵弦，會覆蓋宮弦的輸入參數</li>
          <li> 【基準頻率】卽正調五弦頻率</li>
          <li>【嚴格模式】默認否，程序會自動將音準歸到標準音高，例如按音徽分大多是約值，程序將自動調整。如果輸入 1 開啟嚴格模式，輸出模式 1、2 顯示 undefined，可以將輸出模式切換到 3，查看頻率比。</li>
          <li>【顯示結果】৹ 泛音；◠ 連音；^ 撞；· 在左表示高一個八度，· 在右表示低一個八度；<span class="upline1">上劃線</span>、<span class="upline2">上劃線</span> 高一、兩個普通音差，<span class="dnline1">下劃線</span>、<span class="dnline2">下劃線</span> 低一、兩個普通音差。普通音差＝ 大全音 ﹣ 小全音 ＝ 81/80 = 21.5 音分。</li>
        </ul>
        <p dangerouslySetInnerHTML={{ __html: this.state.output }}></p>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>減字譜 ⇒ 唱名、頻率比、頻率</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-5'>哇</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}