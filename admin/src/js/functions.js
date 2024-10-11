import { _URL } from "./app.js";
import Fetch from "./Fetch.js";

export function dispatchUpdateEvent(arg) {
  const event = new CustomEvent("updateHall", {
    detail: arg,
  });
  document.querySelector(".main").dispatchEvent(event);
}

export async function getHalls(activeHallId = null) {
    let response;
    await Fetch.send("GET", "hall").then(resolve => response = resolve);
    if (response.length > 0 && !activeHallId) {
      activeHallId = response[0].id;
    }
    dispatchUpdateEvent({
      data: response,
      activeHallId,
    });
}
