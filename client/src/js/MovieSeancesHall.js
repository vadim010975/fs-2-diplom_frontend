import { _URL, _URL_HALL } from "./app.js";

export default class MovieSeancesHall {
  constructor(hallName, seances) {
    this.hallName = hallName;
    this.seances = seances;
    this.movieSeancesHallEl = null;
  }

  createMovieSeancesHallEl() {
    this.movieSeancesHallEl = document.createElement("div");
    this.movieSeancesHallEl.classList.add("movie-seances__hall");
    const movieSeancesHallTitleEl = document.createElement("h3");
    movieSeancesHallTitleEl.classList.add("movie-seances__hall-title");
    movieSeancesHallTitleEl.textContent = this.hallName;
    const movieSeancesListEl = document.createElement("ul");
    movieSeancesListEl.classList.add("movie-seances__list");
    this.seances.forEach((seance) => {
      const movieSeancesTimeBlockEl = document.createElement("li");
      movieSeancesTimeBlockEl.classList.add("movie-seances__time-block");
      const movieSeancesTimeEl = document.createElement("a");
      movieSeancesTimeEl.classList.add("movie-seances__time");
      movieSeancesTimeEl.setAttribute("href", _URL_HALL);
      movieSeancesTimeEl.dataset.seanceId = seance.id;
      movieSeancesTimeEl.textContent = seance.start;
      this.onClickMovieSeansesTime = this.onClickMovieSeansesTime.bind(this);
      movieSeancesTimeEl.addEventListener("click", this.onClickMovieSeansesTime);
      movieSeancesTimeBlockEl.appendChild(movieSeancesTimeEl);
      movieSeancesListEl.appendChild(movieSeancesTimeBlockEl);
    });
    this.movieSeancesHallEl.appendChild(movieSeancesHallTitleEl);
    this.movieSeancesHallEl.appendChild(movieSeancesListEl);
  }

  getHallSeancesEl() {
    this.createMovieSeancesHallEl();
    return this.movieSeancesHallEl;
  }

  onClickMovieSeansesTime(e) {
    e.preventDefault();
    const event = new CustomEvent("goToHallHtml", {
      detail: {
        seanceId: e.currentTarget.dataset.seanceId,
      },
    });
    document.querySelector("main").dispatchEvent(event);

  }
}
