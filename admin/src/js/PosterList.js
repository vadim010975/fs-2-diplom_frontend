import { _URL } from "./app.js";
import Poster from "./Poster.js";

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
    this.mainEl.addEventListener("updatePosterList", this.onUpdatePosterList.bind(this));
    this.moviesContainerEl = document.querySelector(".movies-container");
  }

  async onUpdatePosterList() {
    const token = localStorage.getItem('token');
    try {
      const jsonResponse = await fetch(`${_URL}movie`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await jsonResponse.json();
      this.getPosters(response);
      this.renderPosters();
    } catch (error) {
      console.error(error);
    }
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
