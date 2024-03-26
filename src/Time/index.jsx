import React from "react"
import Deci2Clock from './Deci2Clock'
import Clock2Deci from './Clock2Deci'
import NightClock from './NightClock'
import Deci2Stage from './Deci2Stage'
import Date from './Date'
import JD from './JD'
import SC from './SC'
import Year from './Year'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import md1 from '../note/time.md';

export default class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      md: ''
    };
  }
  UNSAFE_componentWillMount() {
    fetch(md1)
      .then(res => res.text())
      .then(text => this.setState({ md: text }))
  }
  render() {
    const { md } = this.state
    return (
      <>
        <section className="modulo">
          <Deci2Clock />
          <br />
          <Clock2Deci />
          <NightClock />
          <Deci2Stage />
          <JD />
          <br />
          <Date />
          <Year />
          <br />
          <SC />
        </section>
        <hr />
        <article>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} children={md} />
        </article>
      </>
    );
  }
}
