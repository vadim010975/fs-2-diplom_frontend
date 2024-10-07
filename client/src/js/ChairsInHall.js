import { _URL } from "./app.js";

export default class ChairsInHall {
  constructor(hallId, seance, date) {
    this.hallId = hallId;
    this.seance = seance;
    this.date = date;
    this.occupiedChairs = [];
    this.setChairsId = null;
    this.chairs = [];
    this.selectedChairsId = [];
    this.init();
  }

  init() {
    this.bindToDom();
    this.getChairs().then(() => {
      this.getOccupiedChairs().then(() => {
        this.containerEl.innerHTML = "";
        this.renderChairs(this.chairs);
      });
    });
  }

  bindToDom() {
    this.containerEl = document.querySelector(".buying-scheme__wrapper");
  }

  async getChairs() {
    try {
      const jsonResponse = await fetch(`${_URL}hall/${this.hallId}/chairs`);
      this.chairs = await jsonResponse.json();
    } catch (error) {
      console.error(error);
    }
  }

  async getOccupiedChairs() {
    try {
      const jsonResponse = await fetch(
        `${_URL}chair/seance/${this.seance.id}/date/${new Date(
          this.date
        ).toLocaleDateString()}`
      );
      this.occupiedChairs = await jsonResponse.json();
    } catch (error) {
      console.error(error);
    }
  }

  renderChairs(chairs) {
    const { rows: rowsCount, places: chairsInRow } = this.getSizeHall(chairs);
    for (let i = 1; i <= rowsCount; i += 1) {
      const rowEl = document.createElement("div");
      rowEl.classList.add("buying-scheme__row");
      for (let j = 1; j <= chairsInRow; j += 1) {
        const chairEl = document.createElement("span");
        chairEl.classList.add("buying-scheme__chair");
        const chair = chairs.find((el) => +el.row === i && +el.place === j);
        if (chair.id) {
          chairEl.dataset.chairId = chair.id;
        }
        if (this.occupiedChairs.includes(chair.id)) {
          chairEl.classList.add("buying-scheme__chair_taken");
        } else {
          if (+chair.type === 2) {
            chairEl.classList.add("buying-scheme__chair_vip");
            chairEl.addEventListener("click", this.onClickChair.bind(this));  
          } else if (+chair.type === 1) {
            chairEl.classList.add("buying-scheme__chair_standart");
            chairEl.addEventListener("click", this.onClickChair.bind(this));
          } else {
            chairEl.classList.add("buying-scheme__chair_disabled");
          }
        }
        rowEl.appendChild(chairEl);
      }
      this.containerEl.appendChild(rowEl);
    }
  }

  onClickChair(e) {
    e.preventDefault();
    if (e.currentTarget.classList.contains("buying-scheme__chair_taken")) {
      return;
    }
    e.currentTarget.classList.toggle("buying-scheme__chair_selected");
    if (e.currentTarget.classList.contains("buying-scheme__chair_selected")) {
      this.addChairToArray(+e.currentTarget.dataset.chairId);
    } else {
      this.removeChairToArray(+e.currentTarget.dataset.chairId);
    }
    this.setChairsId(this.selectedChairsId);
  }

  getSizeHall(chairs) {
    return {
      rows: Math.max(...chairs.map((chair) => chair.row)),
      places: Math.max(...chairs.map((chair) => chair.place)),
    };
  }

  addChairToArray(chairId) {
    if (chairId && !this.selectedChairsId.includes(chairId)) {
      this.selectedChairsId.push(chairId);
    }
  }

  removeChairToArray(chairId) {
    if (chairId && this.selectedChairsId.includes(chairId)) {
      this.selectedChairsId = [
        ...this.selectedChairsId.filter(item => item != chairId),
      ];
    }
  }

  clearChairsId() {
    this.selectedChairsId = [];
  }
}
