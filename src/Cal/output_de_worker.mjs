import { outputNewmWeb_DE } from "./output.mjs";

export default addEventListener("message", (event) => {
  const { eventName, YearStart, YearEnd } = event.data;
  if (eventName === "display") {
    const data = outputNewmWeb_DE(YearStart, YearEnd);
    postMessage(data);
  }
});
