import React from 'react'
import { Pythagorean60 } from '../Cal/guqin'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 81,
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>黃鐘</span>
        <input className='width2'
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print1 = Pythagorean60(this.state.a)
      this.setState({ output1: Print1 })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output1) {
      return null
    }
    return (
      <div className='ans table2' style={{ whiteSpace: "nowrap" }}>
        {/* 京房六十律及其算出之法 www.360doc.com/document/13/0210/22/11311924_265092390.shtml */}
        <table>
          <tr>
            <th></th>
            <th>1黃鐘C</th>
            <th>2林鐘G</th>
            <th>3太簇D</th>
            <th>4南呂A</th>
            <th>5姑洗E</th>
            <th>6應鐘B</th>
            <th>7蕤賓♯F</th>
            <th>8大呂♯C</th>
            <th>9夷則♯G</th>
            <th>10夾鐘♯D</th>
            <th>11无射♯A</th>
            <th>12仲呂♯E</th>
            <th>13執始</th>
            <th>14去滅</th>
            <th>15時息</th>
            <th>16結躬</th>
            <th>17燮虞</th>
            <th>18遲內</th>
            <th>19盛燮</th>
            <th>20分否</th>
            <th>21解形</th>
            <th>22開時</th>
            <th>23閉掩</th>
            <th>24南中</th>
            <th>25丙盛</th>
            <th>26安度</th>
            <th>27屈齊</th>
            <th>28歸期</th>
            <th>29路時</th>
            <th>30未育</th>
            <th>31離宮</th>
            <th>32淩陰</th>
            <th>33去南</th>
            <th>34族嘉</th>
            <th>35鄰齊</th>
            <th>36內負</th>
            <th>37分動</th>
            <th>38歸嘉</th>
            <th>39隨期</th>
            <th>40未卯</th>
            <th>41形始</th>
            <th>42遲時</th>
            <th>43制時</th>
            <th>44少出</th>
            <th>45分積</th>
            <th>46爭南</th>
            <th>47期保</th>
            <th>48物應</th>
            <th>49質末</th>
            <th>50否與</th>
            <th>51形晉</th>
            <th>52夷汗</th>
            <th>53依行</th>
            <th>54色育</th>
            <th>55謙待</th>
            <th>56未知</th>
            <th>57白呂</th>
            <th>58南授</th>
            <th>59分鳥</th>
            <th>60南事</th>
          </tr>
          {(this.state.output1 || []).map(row => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map(d => <td>{d}</td>)}
              </tr>
            )
          })}
        </table>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h4>京房六十律</h4>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>京房</button><span className='Deci64'>n/d</span><span className='Deci64'>.64</span>
        {this.result()}
      </div>
    )
  }
}