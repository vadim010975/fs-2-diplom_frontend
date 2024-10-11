import { _URL } from "./app.js";
import Seance from "./Seance.js";
import Fetch from "./Fetch.js";

export default class HallSeances {
  constructor(hall, movies) {
    this.movies = movies;
    this.hall = hall;
    this.seances = [];
    this.seancesHallEl = null;
  }

  async getSeancesHallElement() {
    await this.getSeances().then(() => {
      this.createHallElement();
    });
    return this.seancesHallEl;
  }

  async getSeances() {
    this.seances = await Fetch.send("GET", `hall/${this.hall.id}/seances`);
  }

  async createHallElement() {
    this.seancesHallEl = document.createElement("div");
    this.seancesHallEl.classList.add("conf-step__seances-hall");
    const seancesTitleEl = document.createElement("h3");
    seancesTitleEl.classList.add("conf-step__seances-title");
    seancesTitleEl.textContent = this.hall.name;
    const seancesTimelineEl = document.createElement("div");
    seancesTimelineEl.classList.add("conf-step__seances-timeline");
    this.seancesHallEl.appendChild(seancesTitleEl);
    this.seancesHallEl.appendChild(seancesTimelineEl);
    this.seances.forEach(item => {
      const seance = new Seance(item, this.movies);
      const seamceEl = seance.getSeancesElement();
      seancesTimelineEl.appendChild(seamceEl);
    });
  }
}
