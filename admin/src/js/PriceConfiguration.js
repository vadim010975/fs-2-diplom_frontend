import { _URL } from "./app.js";
import { getHalls } from "./functions.js";
import HallList from "./HallList.js";

export default class PriceConfiguration {
  constructor() {
    this.activeHallId = null;
    this.init();
  }

  init() {
    this.bindToDom();
    this.hallList = new HallList(this.hallsListEl);
    this.hallList.handlerUpdate = this.update.bind(this);
  }

  bindToDom() {
    this.containerEl = document.querySelector(".price-configuration");
    this.hallsListEl = this.containerEl.querySelector(
      ".price-configuration-halls-list"
    );
    this.formEl = document.querySelector(".price-configuration-form");
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.formEl.addEventListener("submit", this.onSubmitForm);
    this.inputTicketPriceEl = document.querySelector(".ticket-price");
    this.inputVipTicketPriceEl = document.querySelector(".vip-ticket-price");
    this.cancelBtnEl = document.querySelector(
      ".price-configuration-cancel-btn"
    );
    this.onClickCancelBtn = this.onClickCancelBtn.bind(this);
    this.cancelBtnEl.addEventListener("click", this.onClickCancelBtn);
  }

  update(activeHall) {
    this.activeHallId = activeHall.id;
    this.renderPrices(activeHall);
  }

  renderPrices(hall) {
    this.inputTicketPriceEl.value = "";
    this.inputVipTicketPriceEl.value = "";
    this.inputTicketPriceEl.placeholder = hall.ticket_price;
    this.inputVipTicketPriceEl.placeholder = hall.vip_ticket_price;
  }

  onSubmitForm(e) {
    e.preventDefault();
    this.setPrices().then(() => {
      getHalls(this.activeHallId);
    });
  }

  async setPrices() {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${_URL}hall/prices/${this.activeHallId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticket_price: this.inputTicketPriceEl.value,
          vip_ticket_price: this.inputVipTicketPriceEl.value,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }

  onClickCancelBtn(e) {
    e.preventDefault();
    this.inputTicketPriceEl.value = "";
    this.inputVipTicketPriceEl.value = "";
  }
}
