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

    // const token = localStorage.getItem('token');
    // const jsonResponse = await fetch(`${_URL}hall`, {
    //   method: "GET",
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // const response = await jsonResponse.json();
    if (response.length > 0 && !activeHallId) {
      activeHallId = response[0].id;
    }
    dispatchUpdateEvent({
      data: response,
      activeHallId,
    });
}
