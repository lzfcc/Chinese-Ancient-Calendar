import { outputNewmWeb, outputFile, outputDayWeb } from "./output.mjs";

export default addEventListener("message", (event) => {
  const { eventName, YearStart, YearEnd, isAuto, calendars } = event.data;
  let data = null;
  if (eventName === "print") {
    data = outputFile(1, YearStart, YearEnd, isAuto, calendars);
    postMessage(new Blob([data]));
  }
  if (eventName === "display") {
    const data = outputNewmWeb(YearStart, YearEnd, isAuto, calendars);
    postMessage(data);
  }
  if (eventName === "Day") {
    data = outputDayWeb(YearStart, calendars[0]);
    postMessage(data);
  }
});
