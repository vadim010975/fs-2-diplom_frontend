import { _URL } from "./app.js";
import HallList from "./HallList.js";

export default class OpenSales {
  constructor() {
    this.halls = [];
    this.activeHallId = null;
    this.sales = false;
    this.init();
  }

  init() {
    this.bindToDom();
    this.getHalls().then(() => {
      this.hallList = new HallList(this.hallsListEl);
      this.hallList.handlerUpdate = this.updateHalls.bind(this);
    });
  }

  bindToDom() {
    this.paragraphEl = document.querySelector(".footer__paragrarh");
    this.buttonEl = document.querySelector(".footer__button");
    this.onClickBtn = this.onClickBtn.bind(this);
    this.buttonEl.addEventListener("click", this.onClickBtn);
    this.hallsListEl = document.querySelector(
      ".footer-halls-list"
    );
  }

  updateHalls(activeHall) {
    this.activeHallId = activeHall.id;
    this.getHalls().then(() => {
      this.sales = (this.halls.find(hall => hall.id === this.activeHallId)).sales;
    this.renderTextBtn();
    });
  }

  onClickBtn(e) {
    e.preventDefault();
    this.setSales().then(() => {
      this.getHalls().then(() => {
        this.sales = this.halls.find(hall => hall.id === this.activeHallId).sales;
        this.renderTextBtn();
      })
    });
  }

  renderTextBtn() {
    if (this.sales) {
      this.buttonEl.textContent = "Приостановить продажу билетов";
    } else {
      this.buttonEl.textContent = "Открыть продажу билетов";
    }
  }

  async getHalls() {
    const token = localStorage.getItem('token');
    try {
      const jsonResponse = await fetch(`${_URL}hall`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      this.halls = await jsonResponse.json();
    } catch (error) {
      console.error(error);
    }
  }

  async setSales() {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${_URL}hall/${this.activeHallId}/sales`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sales: !this.sales,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }
}