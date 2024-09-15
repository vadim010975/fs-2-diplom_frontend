import HallSeances from "./HallSeances.js";

export default class SeancesList {
  constructor(movies) {
    this.movies = movies;
    this.halls = [];
    this.hallsSeances = [];
    this.init();
  }

  init() {
    this.bindToDom();
  }

  bindToDom() {
    this.mainEl = document.querySelector(".main");
    this.hallUpdateHandler = this.hallUpdateHandler.bind(this);
    this.mainEl.addEventListener("updateHall", this.hallUpdateHandler);
    this.updateHallsSeances = this.updateHallsSeances.bind(this);
    this.mainEl.addEventListener("updateHallsSeances", this.updateHallsSeances);
    this.containerEl = document.querySelector(".conf-step__seances");
  }

  hallUpdateHandler(e) {
    this.halls = e.detail.data;
    this.getHallsSeances(this.halls);
    this.renderHallsSeances();
  }

  getHallsSeances(halls) {
    this.hallsSeances = [];
    halls.forEach(hall => {
      const hallSeances = new HallSeances(hall, this.movies);
      this.hallsSeances.push(hallSeances);
    });
  }

  renderHallsSeances() {
    this.containerEl.innerHTML = "";
    this.hallsSeances.forEach(el => {
      el.getSeancesHallElement().then(elem => {
        this.containerEl.appendChild(elem);
      });
    });
  }

  updateHallsSeances() {
    this.getHallsSeances(this.halls);
    this.renderHallsSeances();
  }
}