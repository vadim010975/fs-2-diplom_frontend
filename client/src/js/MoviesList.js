import { _URL, _URL_HALL } from "./app.js";
import Movie from "./Movie.js";

export default class MoviesList {
  constructor() {
    this.movies = [];
    this.halls = [];
    this.date = null;
    this.init();
  }

  init() {
    this.bindToDom();
  }

  bindToDom() {
    this.containerEl = document.querySelector("main");
    this.containerEl.addEventListener("goToHallHtml", this.goToPageHall.bind(this));
    this.getMoviesList = this.getMoviesList.bind(this);
  }

  async getMoviesList(date) {
    this.date = date;
    this.getMovies(date).then(() => {
      this.getHalls().then(() => {
        this.renderList();
      });
    });
  }

  async getMovies(date) {
    try {
      const formateDate = date.toISOString().slice(0, 10);
      const jsonResponse = await fetch(`${_URL}movie/date/${formateDate}`);
      this.movies = await jsonResponse.json();
    } catch (error) {
      console.error(error);
    }
  }

  async getHalls() {
    try {
      const jsonResponse = await fetch(`${_URL}hall/seances/available`);
      const response = await jsonResponse.json();
      this.halls = response.filter(hall => hall.sales);
    } catch (error) {
      console.error(error);
    }
  }

  renderList() {
    this.containerEl.innerHTML = "";
    this.movies.forEach(item => {
      const movie = new Movie(item, this.halls);
      movie.getMovieEl().then(element => {
        this.containerEl.appendChild(element);
      });
    });
  }

  goToPageHall(e) {
    this.sendDataToSessionStorage(e.detail.seanceId, this.date);
    window.location.href = _URL_HALL;
  }

  sendDataToSessionStorage(seanceId, date) {
    sessionStorage.setItem("seanceId", seanceId);
    sessionStorage.setItem("date", date);
  }
}