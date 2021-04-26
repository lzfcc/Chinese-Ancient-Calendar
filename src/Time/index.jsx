import React from "react"
import Clock from './Clock'
import Clock1 from './Clock1'
import Date from './Date'
import JD from './JD'
import SC from './SC'
import Year from './Year'

export default class Time extends React.Component {
  render() {
    return (
      <section className="modulo">
        <Clock />
        <p></p>
        <Clock1 />
        <JD />
        <p></p>
        <Date />
        <Year />
        <p></p>
        <SC />
      </section>
    );
  }
}
