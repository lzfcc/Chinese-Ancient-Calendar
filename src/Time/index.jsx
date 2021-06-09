import React from "react"
import Clock from './Clock'
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
  componentWillMount() {
    fetch(md1)
      .then(res => res.text())
      .then(text => this.setState({ md: text }))
  }
  render() {
    const { md } = this.state
    return (
      <>
        <section className="modulo">
          <Clock />
          <Deci2Stage />
          <JD />
          <p></p>
          <Date />
          <Year />
          <p></p>
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
