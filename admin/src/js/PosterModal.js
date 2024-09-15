import AddMovieModal from "./AddMovieModal.js";
import { _URL } from "./app.js";
import SeancesTime from "./SeancesTime.js";

export default class PosterModal {
  static movie;
  static containerEl;
  static closeBtnEl;
  static infoTitleEl;
  static infoDurationEl;
  static infoCountryEl;
  static infoDescriptionEl;
  static infoStartDateEl;
  static infoEndDateEl;
  static btnEditEl;
  static hallSelectEl;
  static timeInfoListEl;
  static hoursSelectEl;
  static minutesSelectEl;
  static times;
  static btnAddSeanceEl;
  static btnRemoveAllSeancesEl;
  static btnRemoveMovie;

  static init() {
    PosterModal.bindToDom();
  }

  static bindToDom() {
    PosterModal.containerEl = document.querySelector(".modal-poster");
    PosterModal.closeBtnEl = document.querySelector(".modal-poster__btn-close");
    PosterModal.closeBtnEl.addEventListener(
      "click",
      PosterModal.onClickBtnClose
    );
    PosterModal.infoTitleEl = document.querySelector(
      ".modal-poster-info-title"
    );
    PosterModal.infoDurationEl = document.querySelector(
      ".modal-poster-info-duration"
    );
    PosterModal.infoCountryEl = document.querySelector(
      ".modal-poster-info-country"
    );
    PosterModal.infoDescriptionEl = document.querySelector(
      ".modal-poster-info-description"
    );
    PosterModal.infoStartDateEl = document.querySelector(
      ".modal-poster-info-start_date"
    );
    PosterModal.infoEndDateEl = document.querySelector(
      ".modal-poster-info-end_date"
    );
    PosterModal.btnEditEl = document.querySelector(".modal-poster__btn-edit");
    PosterModal.btnEditEl.addEventListener("click", PosterModal.onClickBtnEdit);
    PosterModal.hallSelectEl = PosterModal.containerEl.querySelector(
      ".modal-poster-hall-select"
    );
    PosterModal.hallSelectEl.addEventListener(
      "change",
      PosterModal.onChangeHall
    );
    PosterModal.timeInfoListEl = PosterModal.containerEl.querySelector(
      ".modal-poster-time-info-list"
    );
    PosterModal.hoursSelectEl = PosterModal.containerEl.querySelector(
      ".modal-poster-input-time-hours"
    );
    PosterModal.hoursSelectEl.addEventListener(
      "change",
      PosterModal.onChangeHour
    );
    PosterModal.minutesSelectEl = PosterModal.containerEl.querySelector(
      ".modal-poster-input-time-minutes"
    );
    PosterModal.btnAddSeanceEl = PosterModal.containerEl.querySelector(
      ".modal-poster__btn-add"
    );
    PosterModal.btnAddSeanceEl.addEventListener(
      "click",
      PosterModal.onClickBtnAddSeance
    );
    PosterModal.btnRemoveAllSeancesEl = PosterModal.containerEl.querySelector(
      ".modal-poster__btn-remove-all"
    );
    PosterModal.btnRemoveAllSeancesEl.addEventListener(
      "click",
      PosterModal.onClickBtnRemoveAllSeances
    );
    PosterModal.btnRemoveMovie = PosterModal.containerEl.querySelector(".modal-poster__btn-remove-movie");
    PosterModal.btnRemoveMovie.addEventListener(
      "click",
      PosterModal.onClickBtnRemoveMovie
    );
  }

  static showModal(movie) {
    PosterModal.movie = movie;
    PosterModal.renderMovieInformation(movie);
    PosterModal.rendertHalls().then(() => {
      PosterModal.renderSeanceTime(movie);
      PosterModal.containerEl.classList.remove("hidden");
    });
  }

  static renderSeanceTime(movie) {
    const seancesTime = new SeancesTime(
      PosterModal.hallSelectEl.value,
      movie
    );
    seancesTime.getAvailableTime().then((res) => {
      PosterModal.renderAvailableTime(res.strings);
      PosterModal.setOptions(res.availableTime);
      PosterModal.times = res.availableTime;
    });
  }

  static renderMovieInformation(movie) {
    PosterModal.infoTitleEl.textContent = movie.title;
    PosterModal.infoDurationEl.textContent = movie.duration;
    PosterModal.infoCountryEl.textContent = movie.country;
    PosterModal.infoDescriptionEl.textContent = movie.description;
    PosterModal.infoStartDateEl.textContent = movie.start_date;
    PosterModal.infoEndDateEl.textContent = movie.end_date;
    if (movie.poster_url) {
      const imgEl = document.createElement("img");
      imgEl.classList.add("modal-poster-info-img");
      imgEl.setAttribute("alt", "poster");
      imgEl.src = movie.poster_url;
      PosterModal.containerEl.querySelector(".modal-poster-info").prepend(imgEl);
    }
  }

  static hideModal() {
    const imgEl = PosterModal.containerEl.querySelector(".modal-poster-info-img");
    if (imgEl) {
      imgEl.remove();
    }
    PosterModal.containerEl.classList.add("hidden");
    PosterModal.movie = undefined;
  }

  static onClickBtnClose() {
    PosterModal.hideModal();
  }

  static onClickBtnEdit() {
    AddMovieModal.edit(PosterModal.movie);
    PosterModal.hideModal();
  }

  static async rendertHalls() {
    PosterModal.hallSelectEl.innerHTML = "";
    await PosterModal.getHalls().then((res) => {
      res.forEach((hall) => {
        const hallTitleEl = document.createElement("option");
        hallTitleEl.value = hall.id;
        hallTitleEl.textContent = hall.name;
        PosterModal.hallSelectEl.appendChild(hallTitleEl);
      });
    });
  }

  static async getHalls() {
    const token = localStorage.getItem('token');
    try {
      const jsonResponse = await fetch(`${_URL}hall`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await jsonResponse.json();
      if (!response.length) {
        return [];
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  static renderAvailableTime(times) {
    PosterModal.timeInfoListEl.innerHTML = "";
    times.forEach((time) => {
      const timeEl = document.createElement("p");
      timeEl.textContent = time;
      PosterModal.timeInfoListEl.appendChild(timeEl);
    });
  }

  static setOptions(times) {
    PosterModal.setHoursOptions(times);
    const minutes = times[PosterModal.hoursSelectEl.value];
    PosterModal.setMinutesOptions(minutes);
  }

  static setHoursOptions(times) {
    PosterModal.hoursSelectEl.innerHTML = "";
    times.forEach((hour, idxHour) => {
      if (hour.some((el) => el || el === 0)) {
        const hourOptionEl = document.createElement("option");
        hourOptionEl.value = idxHour;
        hourOptionEl.textContent = idxHour;
        PosterModal.hoursSelectEl.appendChild(hourOptionEl);
      }
    });
  }

  static setMinutesOptions(minutes) {
    PosterModal.minutesSelectEl.innerHTML = "";
    minutes.forEach((min) => {
      const minutesOptionEl = document.createElement("option");
      minutesOptionEl.value = min;
      minutesOptionEl.textContent = min;
      PosterModal.minutesSelectEl.appendChild(minutesOptionEl);
    });
  }

  static onChangeHour(e) {
    e.preventDefault();
    const value = e.currentTarget.value;
    PosterModal.setMinutesOptions(PosterModal.times[value]);
  }

  static onChangeHall(e) {
    e.preventDefault();
    PosterModal.renderSeanceTime(PosterModal.movie);
  }

  static onClickBtnAddSeance(e) {
    e.preventDefault();
    PosterModal.addSeance().then(() => {
      PosterModal.hideModal();
      PosterModal.updateHallsSeances();
    });
  }

  static async addSeance() {
    const token = localStorage.getItem('token');
    try {
      const jsonResponse  = await fetch(`${_URL}seance`, {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            movie_id: PosterModal.movie.id,
            hall_id: PosterModal.hallSelectEl.value,
            start: `${PosterModal.hoursSelectEl.value}:${PosterModal.minutesSelectEl.value}`,
          }),
      });
      const response = await jsonResponse.json();
      return response.id;
    } catch (error) {
      console.error(error);
    }
  }

  static onClickBtnRemoveAllSeances() {
    PosterModal.removeAllSeances().then(() => {
      PosterModal.hideModal();
      PosterModal.updateHallsSeances();
    });
  }

  static updatePosterList() {
    const event = new CustomEvent("updatePosterList");
    document.querySelector(".main").dispatchEvent(event);
  }

  static updateHallsSeances() {
    const event = new CustomEvent("updateHallsSeances");
    document.querySelector(".main").dispatchEvent(event);
  }

  static async removeAllSeances() {
    const token = localStorage.getItem('token');
    try {
      const jsonResponse  = await fetch(`${_URL}seance/all/${PosterModal.movie.id}`, {
        method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
      });
    } catch (error) {
      console.error(error);
    }
  }

  static onClickBtnRemoveMovie() {
    PosterModal.removeMovie().then(() => {
      PosterModal.hideModal();
      PosterModal.updatePosterList();
      PosterModal.updateHallsSeances();
    });
  }

  static async removeMovie() {
    const token = localStorage.getItem('token');
    try {
      const jsonResponse  = await fetch(`${_URL}movie/${PosterModal.movie.id}`, {
        method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
      });
    } catch (error) {
      console.error(error);
    }
  }

}
