import { D1 } from './day.mjs'
import { D2 } from './day_shixian.mjs'
import Para from './para_calendars.mjs'

export default (Name, YearStart, YearEnd) => {
    const Bind = Name => {
        const type = Para[Name].Type
        if (type === 13) return D2
        else return D1
    }
    const AutoDay = Bind(Name)
    return AutoDay(Name, YearStart, YearEnd)
}