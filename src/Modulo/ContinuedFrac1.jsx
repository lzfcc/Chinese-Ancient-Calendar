import React from "react";
import { ContinuedFrac1 } from '../Cal/modulo_continued-frac1'
import MathJax from "../Mathjax";
import { convertLatex } from "../utils";
export default class a extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
    this.handle = this.handle.bind(this);
  }
  
  input() {
    return (
      <span className='year-select width4'>
        <span>小數</span>
        <input
          value={this.state.Decimal}
          onChange={e => {
            this.setState({ Decimal: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { ans, step, ansPrint } = ContinuedFrac1(this.state.Decimal)
      this.setState({ output1: ansPrint, output2: step, outputContinuedFrac13: ans })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.outputContinuedFrac13) {
      return null
    }
    return (
      <div className='ans' style={{whiteSpace: 'pre-wrap'}}>
        <p>{this.state.output1}</p>
        <p>{this.state.output2}</p>
      </div>
    )
  }
  render() {
    return (
      <div>
  {this.input()}
          <button onClick={this.handle} className='button4-3'>衝衝衝</button>
          {(this.state.outputContinuedFrac13 || []).length > 0 ?
            <MathJax rawLatex={convertLatex(this.state.outputContinuedFrac13)} /> : null
          }
          {this.result()}
      </div>
    );
  }
}
