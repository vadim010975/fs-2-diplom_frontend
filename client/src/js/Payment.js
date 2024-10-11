import { _URL, _URL_TICKET } from "./app.js";
import Fetch from "./Fetch.js";

export default class Payment {
  constructor() {
    this.error = null;
    this.init();
  }

  init() {
    this.bindToDom();
    this.getDataFromSessionStorage();
    this.renderInfo();
  }

  bindToDom() {
    this.containerEl = document.querySelector("main");
    this.ticketDateEl = this.containerEl.querySelector(".ticket__date");
    this.ticketTitleEl = this.containerEl.querySelector(".ticket__title");
    this.ticketChairsEl = this.containerEl.querySelector(".ticket__chairs");
    this.ticketHallEl = this.containerEl.querySelector(".ticket__hall");
    this.ticketStartEl = this.containerEl.querySelector(".ticket__start");
    this.ticketCostEl = this.containerEl.querySelector(".ticket__cost");
    this.acceptinButtonEl = this.containerEl.querySelector(".acceptin-button");
    this.acceptinButtonEl.addEventListener("click", this.onClickAcceptinButtonEl.bind(this));
  }

  renderInfo() {
    this.ticketDateEl.textContent = new Date(this.paymentInfo.date).toLocaleString("ru", { day: "numeric", month: "long", year: "numeric" });
    this.ticketTitleEl.textContent = this.paymentInfo.movieTitle;
    this.ticketChairsEl.textContent = this.paymentInfo.chairs.map(chair => `ряд:${chair.row} место:${chair.place}`).join(", ");
    this.ticketHallEl.textContent = this.paymentInfo.hallName;
    this.ticketStartEl.textContent = this.paymentInfo.seance.start;
    this.ticketCostEl.textContent = this.paymentInfo.cost;
  }

  getDataFromSessionStorage() {
     this.paymentInfo = JSON.parse(sessionStorage.getItem("paymentInfo"));
  }

  async onClickAcceptinButtonEl() {
    console.log("onClickAcceptinButtonEl");
    console.log(this.paymentInfo.chairs);
    for (const chair of this.paymentInfo.chairs) {
      console.log(chair);
      await this.saveTicketInformation(chair.id);
    }
    console.log(this.error);
    if (!this.error) {
      window.location.href = _URL_TICKET;
    }
  }

  async saveTicketInformation(chairId) {
    console.log(chairId);
    try {
      const response = await Fetch.send("POST", "ticket", {
        bodyJson:
          {
            date: new Date(this.paymentInfo.date).toLocaleDateString(),
            seance_id: this.paymentInfo.seance.id,
            chair_id: chairId,
          },
        cleanResponse: true,
      });


      // const response = await fetch(`${_URL}ticket`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     date: new Date(this.paymentInfo.date).toLocaleDateString(),
      //     seance_id: this.paymentInfo.seance.id,
      //     chair_id: chairId,
      //   }),
      // });
      if (!response.ok) {
        throw new Error(response.status);
      }
    } catch (error) {
      this.error = error;
    }
  }
}