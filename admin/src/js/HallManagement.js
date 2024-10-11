import { _URL } from "./app.js";
import { getHalls } from "./functions.js";
import {
  defaultRows,
  defaultChairsInRow,
  ticketPrice,
  vipTicketPrice,
} from "./defaultHallData.js";
import Fetch from "./Fetch.js";

export default class HallManagement {
  constructor(halls = []) {
    this.halls = halls;
    this.init();
  }

  init() {
    this.bindToDom();
    this.renderHalls();
  }

  bindToDom() {
    this.mainEl = document.querySelector(".main");
    this.updateHandler = this.updateHandler.bind(this);
    this.mainEl.addEventListener("updateHall", this.updateHandler);
    this.containerEl = document.querySelector(".hall-management");
    this.btnCreateHallEl = this.containerEl.querySelector(".create-hall");
    this.onClickBtnCreateHall = this.onClickBtnCreateHall.bind(this);
    this.btnCreateHallEl.addEventListener("click", this.onClickBtnCreateHall);
    this.hallListEl = this.containerEl.querySelector(".hall-list");
    this.modalEl = this.containerEl.querySelector(".modal-create-hall");
    this.modalBtnCloseEl = this.modalEl.querySelector(
      ".modal-create-hall__btn-close"
    );
    this.onClickBtnModalClose = this.onClickBtnModalClose.bind(this);
    this.modalBtnCloseEl.addEventListener("click", this.onClickBtnModalClose);
    this.modalInputEl = this.modalEl.querySelector(".modal-create-hall__input");
    this.modalFormEl = this.modalEl.querySelector(".modal-create-hall__form");
    this.onSubmitModalForm = this.onSubmitModalForm.bind(this);
    this.modalFormEl.addEventListener("submit", this.onSubmitModalForm);
  }

  updateHandler(e) {
    this.halls = e.detail.data;
    this.renderHalls();
  }

  renderHalls() {
    this.hallListEl.innerHTML = "";
    this.halls.forEach((hall) => {
      const hallEl = document.createElement("li");
      hallEl.textContent = `${hall.name} `;
      const btnRemoveEl = document.createElement("button");
      btnRemoveEl.classList.add("conf-step__button", "conf-step__button-trash");
      btnRemoveEl.addEventListener("click", () => this.btnRemoveHandle(hall));
      hallEl.appendChild(btnRemoveEl);
      this.hallListEl.appendChild(hallEl);
    });
  }

  btnRemoveHandle(hall) {
    this.removeHall(hall).then(() => getHalls());
  }

  async removeHall(hall) {
    await Fetch.send("DELETE", `hall/${hall.id}`);
  }

  onClickBtnCreateHall() {
    this.showModal();
  }

  showModal() {
    this.modalEl.classList.remove("hidden");
  }

  onClickBtnModalClose(e) {
    e.preventDefault();
    this.hideModal();
  }

  hideModal() {
    this.modalInputEl.value = "";
    this.modalEl.classList.add("hidden");
  }

  onSubmitModalForm(e) {
    e.preventDefault();
    const hallName = this.modalInputEl.value;
    this.hideModal();

    this.addHall(hallName).then((hallId) => {
      const defaultChairs = this.createDefaultChairs(
        defaultRows,
        defaultChairsInRow,
        hallId
      );
      this.sendDefaultChairs(defaultChairs).then(() => getHalls(hallId));
    });
  }

  async addHall(hall) {
    const response = await Fetch.send("POST", "hall", {
      bodyJson: {
        name: hall,
        ticket_price: ticketPrice,
        vip_ticket_price: vipTicketPrice,
        sales: false,
      },
    });
    return response.id;
  }

  /**
   * Функция отправляет кресла для создания их в новом зале
   * в креслах указаны hall_id, row, place, type
   *
   * @async
   * @param {*} chairs
   * @returns {*}
   */
  async sendDefaultChairs(chairs) {
    await Fetch.send("POST", "chair", { bodyJson: { chairs } });
  }

  createDefaultChairs(defaultRows, defaultChairsInRow, hallId) {
    const defaultChairs = [];
    for (let i = 1; i <= defaultRows; i += 1) {
      for (let j = 1; j <= defaultChairsInRow; j += 1) {
        defaultChairs.push({
          hall_id: hallId,
          row: i,
          place: j,
          type: "1",
        });
      }
    }
    return defaultChairs;
  }
}
