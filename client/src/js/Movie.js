import { _URL } from "./app.js";
import MovieSeancesHall from "./MovieSeancesHall.js";

export default class Movie {
  constructor(movie, halls) {
    this.movie = movie;
    this.halls = halls;
  }

  async createMovieEl() {
    this.movieEl = document.createElement("section");
    this.movieEl.classList.add("movie");
    const movieInfoEl = this.createMovieInfoEl();
    this.movieEl.appendChild(movieInfoEl);
    this.halls.forEach((hall) => {
      this.getSeances(hall.id).then((seances) => {
        if (seances.length > 0) {
          const movieSeancesHall = new MovieSeancesHall(hall.name, seances);
          const movieSeancesHallEl = movieSeancesHall.getHallSeancesEl();
          this.movieEl.appendChild(movieSeancesHallEl);
        }
      });
    });
  }

  createMovieInfoEl() {
    const movieInfoEl = document.createElement("div");
    movieInfoEl.classList.add("movie__info");
    const moviePosterEl = document.createElement("div");
    moviePosterEl.classList.add("movie__poster");
    const moviePosterImageEl = document.createElement("img");
    moviePosterImageEl.classList.add("movie__poster-image");
    moviePosterImageEl.setAttribute("alt", "постер");
    moviePosterImageEl.setAttribute("src", this.movie.poster_url);
    moviePosterEl.appendChild(moviePosterImageEl);
    const movieDescriptionEl = document.createElement("div");
    movieDescriptionEl.classList.add("movie__description");
    const movieTitleEl = document.createElement("h2");
    movieTitleEl.classList.add("movie__title");
    movieTitleEl.textContent = this.movie.title;
    const movieSynopsisEl = document.createElement("p");
    movieSynopsisEl.classList.add("movie__synopsis");
    movieSynopsisEl.textContent = this.movie.description;
    const movieDataEl = document.createElement("p");
    movieDataEl.classList.add("movie__data");
    const movieDataDurationEl = document.createElement("span");
    movieDataDurationEl.classList.add("movie__data-duration");
    movieDataDurationEl.textContent = `${this.movie.duration} минут`;
    const movieDataOriginEl = document.createElement("span");
    movieDataOriginEl.classList.add("movie__data-origin");
    movieDataOriginEl.textContent = this.movie.country;
    movieDataEl.appendChild(movieDataDurationEl);
    movieDataEl.appendChild(movieDataOriginEl);
    movieDescriptionEl.appendChild(movieTitleEl);
    movieDescriptionEl.appendChild(movieSynopsisEl);
    movieDescriptionEl.appendChild(movieDataEl);
    movieInfoEl.appendChild(moviePosterEl);
    movieInfoEl.appendChild(movieDescriptionEl);
    return movieInfoEl;
  }

  async getMovieEl() {
    await this.createMovieEl();
    return this.movieEl;
  }

  async getSeances(hallId) {
    try {
      const jsonResponse = await fetch(
        `${_URL}hall/${hallId}/seances/${this.movie.id}`
      );
      return jsonResponse.json();
    } catch (error) {
      console.error(error);
    }
  }
}
