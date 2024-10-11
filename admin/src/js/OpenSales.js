import { _URL } from "./app.js";
import HallList from "./HallList.js";
import Fetch from "./Fetch.js";

export default class OpenSales {
  constructor(halls = []) {
    this.halls = halls;
    this.activeHallId = this.halls.length > 0 ? this.halls[0].id : null;
    this.sales = false;
    this.requestSeances(this.activeHallId).then(resolve => {
      this.btnActivity = resolve;
      this.init();
    });
  }

  init() {
    this.bindToDom();
    this.hallList = new HallList(this.hallsListEl, this.halls);
    this.hallList.handlerUpdate = this.updateHalls.bind(this);
    this.hallList.init();
  }

  bindToDom() {
    this.mainEl = document.querySelector("main");
    this.mainEl.addEventListener("updateHallsSeances", this.onUpdateSeances.bind(this));
    this.paragraphEl = document.querySelector(".footer__paragrarh");
    this.buttonEl = document.querySelector(".footer__button");
    this.onClickBtn = this.onClickBtn.bind(this);
    this.buttonEl.addEventListener("click", this.onClickBtn);
    this.hallsListEl = document.querySelector(
      ".footer-halls-list"
    );
  }

  updateHalls(activeHall) {
    if (!activeHall) {
      return;
    }
    this.activeHallId = activeHall.id;
    this.getHalls().then(() => {
      this.requestSeances(this.activeHallId).then(resolve => {
        this.btnActivity = resolve;
        this.sales = this.halls.find(hall => hall.id === this.activeHallId).sales;
        this.renderTextBtn();
      });
    });
  }

  onClickBtn(e) {
    e.preventDefault();
    if (!this.activeHallId) {
      return;
    }
    this.setSales().then(() => {
      this.getHalls().then(() => {
        this.requestSeances(this.activeHallId).then(resolve => {
          this.btnActivity = resolve;
          this.sales = this.halls.find(hall => hall.id === this.activeHallId).sales;
          this.renderTextBtn();
        });
      });
    });
  }

  renderTextBtn() {
    if (this.btnActivity) {
      this.buttonEl.style.display = "";
      this.paragraphEl.textContent = "Всё готово, теперь можно:";
    } else {
      this.buttonEl.style.display = "none";
      this.paragraphEl.textContent = "";
      if (this.sales){
        this.setSales();
      } 
    }
    if (this.sales) {
      this.buttonEl.textContent = "Приостановить продажу билетов";
    } else {
      this.buttonEl.textContent = "Открыть продажу билетов";
    }
  }

  async getHalls() {
    this.halls = await Fetch.send("GET", "hall");

    // const token = localStorage.getItem('token');
    // try {
    //   const jsonResponse = await fetch(`${_URL}hall`, {
    //     method: "GET",
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   this.halls = await jsonResponse.json();
    // } catch (error) {
    //   console.error(error);
    // }
  }

  async setSales() {
    await Fetch.send("PUT", `hall/${this.activeHallId}/sales`, { bodyJson: { sales: !this.sales, } });

    // const token = localStorage.getItem('token');
    // try {
    //   await fetch(`${_URL}hall/${this.activeHallId}/sales`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({
    //       sales: !this.sales,
    //     }),
    //   });
    // } catch (error) {
    //   console.error(error);
    // }
  }

  async requestSeances(hallId) {
    if (!hallId) {
      return null;
    }
    const response = await Fetch.send("GET", `hall/${hallId}/seances`);
    return response.length > 0 ? true : false;

    // const token = localStorage.getItem('token');
    // try {
    //   const jsonResponse = await fetch(`${_URL}hall/${hallId}/seances`, {
    //     method: "GET",
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   const response = await jsonResponse.json();
    //   return response.length > 0 ? true : false;
    // } catch (error) {
    //   console.error(error);
    // }
  }

  onUpdateSeances() {
    this.getHalls().then(() => {
      this.requestSeances(this.activeHallId).then(resolve => {
        this.btnActivity = resolve;
        this.sales = this.halls.find(hall => hall.id === this.activeHallId).sales;
        this.renderTextBtn();
      });
    });
  }
}