import {
    outputData,
    outputFile,
    outputDayData
} from './output.mjs'

export default addEventListener('message', event => {
    const {
        eventName,
        YearStart,
        YearEnd,
        AutoMode,
        calendars
    } = event.data
    let data = null
    if (eventName === 'print') {
        data = outputFile(1, YearStart, YearEnd, AutoMode, calendars)
        postMessage(new Blob([data]))
    }
    if (eventName === 'display') {
        data = outputData(YearStart, YearEnd, AutoMode, calendars)
        postMessage(data)
    }
    if (eventName === 'Day') {
        data = outputDayData(YearStart, calendars[0])
        postMessage(data)
    }
})