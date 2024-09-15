import PosterModal from "./PosterModal.js";

export default class Poster {
  constructor(arg) {
    this.movie = arg;
  }

  getElement() {
    const movieEl = document.createElement("div");
    movieEl.classList.add("conf-step__movie");
    movieEl.addEventListener("click", this.onClickPoster.bind(this));
    if (this.movie.poster_url) {
      const imgEl = document.createElement("img");
      imgEl.classList.add("conf-step__movie-poster");
      imgEl.setAttribute("alt", "poster");
      imgEl.setAttribute("src", this.movie.poster_url);
      movieEl.appendChild(imgEl);
    }
    const titleEl = document.createElement("h3");
    titleEl.classList.add("conf-step__movie-title");
    titleEl.textContent = this.movie.title;
    const durationEl = document.createElement("p");
    durationEl.classList.add("conf-step__movie-duration");
    durationEl.textContent = `${this.movie.duration} минут`;
    movieEl.appendChild(titleEl);
    movieEl.appendChild(durationEl);
    return movieEl;
  }

  onClickPoster() {
    PosterModal.showModal(this.movie);
  }
}
