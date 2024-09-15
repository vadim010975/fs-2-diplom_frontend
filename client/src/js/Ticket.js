import { _URL } from "./app.js";

export default class Ticket {
  constructor() {
    this.init();
  }

  init() {
    this.bindToDom();
    this.getDataFromSessionStorage();
    this.getQrCode().then(resolve => {
      this.renderInfo(resolve);
    });
  }

  bindToDom() {
    this.containerEl = document.querySelector("main");
    this.ticketDateEl = this.containerEl.querySelector(".ticket__date");
    this.ticketTitleEl = this.containerEl.querySelector(".ticket__title");
    this.ticketChairsEl = this.containerEl.querySelector(".ticket__chairs");
    this.ticketHallEl = this.containerEl.querySelector(".ticket__hall");
    this.ticketStartEl = this.containerEl.querySelector(".ticket__start");
    this.ticketInfoQrEl = this.containerEl.querySelector(".ticket__info-qr");
  }

  renderInfo(qrCodeUrl) {
    this.ticketDateEl.textContent = new Date(this.paymentInfo.date).toLocaleString("ru", { day: "numeric", month: "long", year: "numeric" });
    this.ticketTitleEl.textContent = this.paymentInfo.movieTitle;
    this.ticketChairsEl.textContent = this.paymentInfo.chairs
      .map((chair) => `ряд:${chair.row} место:${chair.place}`)
      .join(", ");
    this.ticketHallEl.textContent = this.paymentInfo.hallName;
    this.ticketStartEl.textContent = this.paymentInfo.seance.start;
    this.ticketInfoQrEl.src = qrCodeUrl;
  }

  getDataFromSessionStorage() {
    this.paymentInfo = JSON.parse(sessionStorage.getItem("paymentInfo"));
  }

  async getQrCode() {
    try {
      const jsonResponse = await fetch(`${_URL}qrcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketTitle: this.paymentInfo.movieTitle,
          ticketChairs: this.paymentInfo.chairs
            .map((chair) => `ряд:${chair.row} место:${chair.place}`)
            .join(", "),
          ticketHall: this.paymentInfo.hallName,
          ticketStart: this.paymentInfo.seance.start,
        }),
      });
      const response = await jsonResponse.json();
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
