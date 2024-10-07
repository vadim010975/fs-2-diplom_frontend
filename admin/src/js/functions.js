import { _URL } from "./app.js";

export function dispatchUpdateEvent(arg) {
  const event = new CustomEvent("updateHall", {
    detail: arg,
  });
  document.querySelector(".main").dispatchEvent(event);
}

export async function getHalls(activeHallId = null) {
  const token = localStorage.getItem('token');
  try {
    const jsonResponse = await fetch(`${_URL}hall`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const response = await jsonResponse.json();
    if (response.length > 0 && !activeHallId) {
      activeHallId = response[0].id;
    }
    dispatchUpdateEvent({
      data: response,
      activeHallId,
    });
  } catch (error) {
    console.error(error);
  }
}
