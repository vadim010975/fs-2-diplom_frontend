import SeanceModal from "./SeanceModal.js";

export default class Seance {

  constructor(seance, movies) {
    this.seance = seance;
    this.movies = movies;
    this.colors = [
      "CAFF85",
      "85FF89",
      "85FFD3",
      "85E2FF",
      "8599FF",
      "BA85FF",
      "FF85FB",
      "FF85B1",
      "FFA885",
      "FFEB85",
    ];
  }

  getSeancesElement() {
    const seancesMovieEl = document.createElement("div");
    seancesMovieEl.classList.add("conf-step__seances-movie");
    this.onClickSeance = this.onClickSeance.bind(this);
    seancesMovieEl.addEventListener("click", this.onClickSeance);
    const seancesMovieTitleEl = document.createElement("p");
    seancesMovieTitleEl.classList.add("conf-step__seances-movie-title");
    const title = this.movies.find(
      (movie) => movie.id === this.seance.movie_id
    ).title;
    seancesMovieTitleEl.textContent = title;
    const seancesMovieStartEl = document.createElement("p");
    seancesMovieStartEl.classList.add("conf-step__seances-movie-start");
    seancesMovieStartEl.textContent = this.seance.start;
    seancesMovieEl.appendChild(seancesMovieTitleEl);
    seancesMovieEl.appendChild(seancesMovieStartEl);
    const idx = this.movies.findIndex(
      (movie) => movie.id === this.seance.movie_id
    );
    seancesMovieEl.style.backgroundColor = `#${this.colors[idx]}`;
    seancesMovieEl.style.width = `${this.movies[idx].duration * 0.5}px`;
    const colonIdx = this.seance.start.indexOf(":");
    const startMinutes =
      parseInt(this.seance.start.slice(0, colonIdx)) * 60 +
      parseInt(this.seance.start.slice(colonIdx + 1));
    seancesMovieEl.style.left = `${startMinutes * 0.5}px`;
    return seancesMovieEl;
  }

  onClickSeance() {
    SeanceModal.showModal(this.seance.id);
  }
}
