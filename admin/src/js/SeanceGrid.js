import { _URL } from "./app.js";
import AddMovieModal from "./AddMovieModal.js";
import PosterList from "./PosterList.js";
import PosterModal from "./PosterModal.js";
import SeancesList from "./SeanceList.js";
import SeanceModal from "./SeanceModal.js";

export default class SeanceGrid {
  constructor() {
    this.init();
  }

  init() {
    this.bindToDom();
    this.getMovies().then(movies => {
      AddMovieModal.init();
      this.posterList = new PosterList(movies);
      PosterModal.init();
      this.seancesList = new SeancesList(movies);
      SeanceModal.init();
    });
  }

  bindToDom() {
    this.mainEl = document.querySelector(".main");
    this.updateHandler = this.updateHandler.bind(this);
    this.mainEl.addEventListener("updateHall", this.updateHandler);
    this.addMovieBtnEl = document.querySelector(".add-movie-btn");
    this.onClickAddMovieBtn = this.onClickAddMovieBtn.bind(this);
    this.addMovieBtnEl.addEventListener("click", this.onClickAddMovieBtn);
  }

  onClickAddMovieBtn() {
    AddMovieModal.showModal();
  }

  updateHandler(e) {
    this.halls = e.detail.data;
    this.activeHallId = e.detail.id;
  }

  async getMovies() {
    const token = localStorage.getItem('token');
    try {
      const jsonResponse = await fetch(`${_URL}movie`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await jsonResponse.json();
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
