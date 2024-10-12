import { _URL } from "./app.js";
import Poster from "./Poster.js";
import Fetch from "./Fetch.js";

export default class PosterList {
  constructor(movies) {
    this.posters = [];
    this.getPosters(movies);
    this.init();
  }

  init() {
    this.bindToDom();
    this.renderPosters();
  }

  bindToDom() {
    this.mainEl = document.querySelector(".main");
    this.mainEl.addEventListener("updateMovies", this.onUpdatePosterList.bind(this));
    this.moviesContainerEl = document.querySelector(".movies-container");
  }

  async onUpdatePosterList() {
    const response = await Fetch.send("GET", "movie");
      this.getPosters(response);
      this.renderPosters();
  }

  renderPosters() {
    this.moviesContainerEl.innerHTML = "";
    this.posters.forEach((poster) => {
      this.moviesContainerEl.append(poster.getElement());
    });
  }

  getPosters(movies) {
    this.posters = [];
    movies.forEach(movie => {
      const poster = new Poster(movie);
      this.posters.push(poster);
    });
  }
}
