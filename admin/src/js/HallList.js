export default class HallList {
  static counter = 0;
  constructor(containerEl) {
    HallList.counterIncrement();
    this.objectId = HallList.counter;
    this.containerEl = containerEl;
    this.halls = [];
    this.activeHallId = [];
    this.handlerUpdate = null;
    this.init();
  }
  static counterIncrement() {
    HallList.counter += 1;
  }

  init() {
    this.bindToDom();
  }

  bindToDom() {
    this.mainEl = document.querySelector(".main");
    this.onUpdate = this.onUpdate.bind(this);
    this.mainEl.addEventListener("updateHall", this.onUpdate);
    this.onUpdateActiveHall = this.onUpdateActiveHall.bind(this);
    this.mainEl.addEventListener("updateActiveHall", this.onUpdateActiveHall);
    this.onChangeHallsList = this.onChangeHallsList.bind(this);
  }

  onUpdate(e) {
    this.halls = e.detail.data;
    this.activeHallId = e.detail.activeHallId;
    const activeHall = this.halls.find(hall => hall.id === this.activeHallId);
    this.renderHallsList();
    this.handlerUpdate(activeHall);
  }

  onUpdateActiveHall(e) {
    if (e.detail.objectId !== this.objectId) {
      const activeHall = e.detail.activeHall;
      this.activeHallId = activeHall.id;
      this.renderHallsList();
      this.handlerUpdate(activeHall);
    }
  }

  renderHallsList() {
    this.containerEl.innerHTML = "";
    let name;
    if (this.containerEl.classList.contains("hall-configuration-halls-list")) {
      name = "chairs-hall";
    } else if (this.containerEl.classList.contains("price-configuration-halls-list")) {
      name = "prices-hall";
    }
    this.halls.forEach((hall) => {
      const element = document.createElement("li");
      element.innerHTML = `<input type="radio" class="conf-step__radio" name=${name} value=${hall.name}>
        <span class="conf-step__selector">${hall.name}</span>`;
      element.addEventListener("change", () => this.onChangeHallsList(hall));
      if (hall.id === this.activeHallId) {
        element.querySelector("input").setAttribute("checked", true);
      }
      this.containerEl.appendChild(element);
    });
  }

  onChangeHallsList(hall) {
    this.setActiveHallId(hall.id);
    this.handlerUpdate(hall);
    this.updateActiveHall(hall);
  }

  updateActiveHall(activeHall) {
    const event = new CustomEvent("updateActiveHall", {
      detail:
      {
        activeHall,
        objectId: this.objectId,
      }
    });
    this.mainEl.dispatchEvent(event);
  }

  setActiveHallId(id) {
    this.activeHallId = id;
  }
}
