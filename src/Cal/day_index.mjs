import D1 from './day.mjs'
import D2 from './day_shixian.mjs'
import Para from './para_calendars.mjs'

export default (CalName, YearStart, YearEnd) => {
    const Bind = CalName => {
        const type = Para[CalName].Type
        if (type === 13) return D2
        else return D1
    }
    const AutoDay = Bind(CalName)
    return AutoDay(CalName, YearStart, YearEnd)
}