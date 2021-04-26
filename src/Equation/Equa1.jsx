import React from "react";
import { HighEqua1 } from "../Cal/equa_high";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nine1: 0,
      eight1: 0,
      seven1: 0,
      six1: 0,
      five1: 0,
      four1: 0,
      three1: -2,
      two1: 1,
      one1: 1,
      zero1: 1,
      upperRaw: 2,
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <p className='note'>需要預先估計根所在的範圍，正負皆可。也可用來高次開方。<span className='decimal64'>.64</span></p>
        <input className='width2'
          value={this.state.nine1}
          onChange={(e) => {
            this.setState({ nine1: e.currentTarget.value });
          }}
        />
        <span>x<sup>9</sup> + </span>
        <input className='width2'
          value={this.state.eight1}
          onChange={(e) => {
            this.setState({ eight1: e.currentTarget.value });
          }}
        />
        <span>x<sup>8</sup> + </span>
        <input className='width2'
          value={this.state.seven1}
          onChange={(e) => {
            this.setState({ seven1: e.currentTarget.value });
          }}
        />
        <span>x<sup>7</sup> + </span>
        <input className='width2'
          value={this.state.six1}
          onChange={(e) => {
            this.setState({ six1: e.currentTarget.value });
          }}
        />
        <span>x<sup>6</sup> + </span>
        <input className='width2'
          value={this.state.five1}
          onChange={(e) => {
            this.setState({ five1: e.currentTarget.value });
          }}
        />
        <span>x<sup>5</sup> + </span>
        <input className='width2'
          value={this.state.four1}
          onChange={(e) => {
            this.setState({ four1: e.currentTarget.value });
          }}
        />
        <span>x<sup>4</sup> + </span>
        <input className='width2'
          value={this.state.three1}
          onChange={(e) => {
            this.setState({ three1: e.currentTarget.value });
          }}
        />
        <span>x<sup>3</sup> + </span>
        <input className='width2'
          value={this.state.two1}
          onChange={(e) => {
            this.setState({ two1: e.currentTarget.value });
          }}
        />
        <span>x<sup>2</sup> + </span>
        <input className='width2'
          value={this.state.one1}
          onChange={(e) => {
            this.setState({ one1: e.currentTarget.value });
          }}
        />
        <span>x + </span>
        <input className='width2'
          value={this.state.zero1}
          onChange={(e) => {
            this.setState({ zero1: e.currentTarget.value });
          }}
        />
        <span> = 0</span>
        <p></p>
        <span> 估根</span>
        <input className='width2'
          value={this.state.upperRaw}
          onChange={(e) => {
            this.setState({ upperRaw: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { upper } = HighEqua1(this.state.nine1, this.state.eight1, this.state.seven1, this.state.six1, this.state.five1, this.state.four1, this.state.three1, this.state.two1, this.state.one1, this.state.zero1, this.state.upperRaw)
      this.setState({ output: upper })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.output}</p>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>二分迭代法</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-6'>解</button>
        {this.result()}
      </div>
    );
  }
}
