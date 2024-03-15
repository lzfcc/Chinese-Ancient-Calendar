import React from 'react'
import { bindStarEclp2Equa } from '../Cal/astronomy_bind'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Sobliq: 23.5,
      Lon: 10,
      Lat: 10
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>黃赤交角</span>
        <input className='width3'
          value={this.state.Sobliq}
          onChange={e => {
            this.setState({ Sobliq: e.currentTarget.value });
          }}
        />
        <span> 黃經</span>
        <input className='width2'
          value={this.state.Lon}
          onChange={e => {
            this.setState({ Lon: e.currentTarget.value });
          }}
        />
        <span> 黃緯</span>
        <input className='width2'
          value={this.state.Lat}
          onChange={e => {
            this.setState({ Lat: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { EquaLon, EquaLat, Ceclp, Dif, DifMax } = bindStarEclp2Equa(this.state.Sobliq, this.state.Lon, this.state.Lat, this.state.Dif, this.state.DifMax)
      this.setState({ EquaLon, EquaLat, Ceclp, Dif, DifMax })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.EquaLon) {
      return null
    }
    return (
      <div className='ans table2 right'>
        <p>赤經 {this.state.EquaLon}° 赤緯 {this.state.EquaLat}°</p>
        <p>極黃經 {this.state.Ceclp}° 與黃經之差 {this.state.Dif}°</p>
        <p>{this.state.DifMax}</p>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>黃道 ⇒ 赤道、極黃經</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-6'>Eclp⇒Equa</button>
        {this.result()}
      </div>
    )
  }
}