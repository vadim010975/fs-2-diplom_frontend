import { _URL, _URL_PAYMENT } from "./app.js";
import ChairsInHall from "./ChairsInHall.js";

export default class Hall {
  constructor() {
    this.seance = null;
    this.movie = null;
    this.hall = null;
    this.date = null;
    this.selectedChairsId = [];
    this.selectedChairs = [];
    this.init();
  }

  init() {
    this.bindToDom();
    const seanceId = this.getDataFromSessionStorage();
    this.getBuyingInfo(seanceId).then(() => {
      this.renderBuyingInfo();
      this.renderPrices();
      this.chairsInHall = new ChairsInHall(this.hall.id, this.seance, this.date);
      this.chairsInHall.setChairsId = this.setChairsId.bind(this);
    });
  }

  bindToDom() {
    this.containerEl = document.querySelector("main");
    this.buyingInfoDateEl = this.containerEl.querySelector(
      ".buying__info-date"
    );
    this.buyingInfoTitleEl = this.containerEl.querySelector(
      ".buying__info-title"
    );
    this.buyingInfoStartEl = this.containerEl.querySelector(
      ".buying__info-start"
    );
    this.buyingInfoHallEl =
      this.containerEl.querySelector(".buying__info-hall");
    this.priceStandartEl = this.containerEl.querySelector(
      ".buying-scheme__chair_standart + .buying-scheme__legend-value"
    );
    this.priceVipEl = this.containerEl.querySelector(
      ".buying-scheme__chair_vip + .buying-scheme__legend-value"
    );
    this.acceptinBtnEl = this.containerEl.querySelector(".acceptin-button");
    this.acceptinBtnEl.addEventListener(
      "click",
      this.onClickAcceptinBtn.bind(this)
    );
  }

  getDataFromSessionStorage() {
    this.date = sessionStorage.getItem("date");
    return sessionStorage.getItem("seanceId");
  }

  async getBuyingInfo(seanceId) {
    try {
      const jsonResponse = await fetch(`${_URL}seance/${seanceId}`);
      const response = await jsonResponse.json();
      this.hall = response.hall;
      this.movie = response.movie;
      this.seance = response.seance;
    } catch (error) {
      console.error(error);
    }
  }

  renderBuyingInfo() {
    this.buyingInfoDateEl.textContent = new Date(this.date).toLocaleString("ru", { day: "numeric", month: "long", year: "numeric" });
    this.buyingInfoTitleEl.textContent = this.movie.title;
    this.buyingInfoStartEl.textContent = "Начало сеанса: " + this.seance.start;
    this.buyingInfoHallEl.textContent = this.hall.name;
  }

  renderPrices() {
    this.priceVipEl.textContent = this.hall.vip_ticket_price;
    this.priceStandartEl.textContent = this.hall.ticket_price;
  }

  onClickAcceptinBtn(e) {
    e.preventDefault();
    if (this.selectedChairsId.length === 0) {
      return;
    }
    this.getSelectedChairs();
    this.chairsInHall.clearChairsId();
  }

  sendDataToSessionStorage() {
    sessionStorage.setItem(
      "paymentInfo",
      JSON.stringify({
        date: this.date,
        movieTitle: this.movie.title,
        chairs: this.selectedChairs,
        hallName: this.hall.name,
        seance: this.seance,
        cost: this.getCost(),
      })
    );
    this.selectedChairs = [];
  }

  setChairsId(chairsId) {
    this.selectedChairsId = [...chairsId];
  }

  async getSelectedChairs() {
    for (const chairId of this.selectedChairsId) {
      const chair = await this.getChair(chairId);
      this.selectedChairs.push(chair);
    }
    this.goToPagePayment();
  }

  async getChair(chairId) {
    try {
      const jsonResponse = await fetch(`${_URL}chair/${chairId}`);
      return jsonResponse.json();
    } catch (error) {
      console.error(error);
    }
  }

  getCost() {
    const types = this.selectedChairs.map((chair) => chair.type);
    let sum = 0;
    types.forEach((type) => {
      if (+type === 1) {
        sum += this.hall.ticket_price;
      } else if (+type === 2) {
        sum += this.hall.vip_ticket_price;
      } else {
        console.error("Некорректный тип места в зале");
        return;
      }
    });
    return sum;
  }

  goToPagePayment() {
    this.sendDataToSessionStorage();
    this.selectedChairsId = [];
    this.selectedChairs = [];
    window.location.href = _URL_PAYMENT;
  }
}
