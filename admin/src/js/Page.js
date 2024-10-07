import { _URL } from "./app.js";
import { getHalls } from "./functions.js";
import HallManagement from "./HallManagement.js";
import HallConfiguration from "./HallConfiguration.js";
import PriceConfiguration from "./PriceConfiguration.js";
import SeanceGrid from "./SeanceGrid.js";
import OpenSales from "./OpenSales.js";

export default class Page {
  constructor(container) {
    this.containerEl = container;
    this.halls = [];
  }

  async init() {
    this.halls = await this.getHalls();
    this.initAccordeon();
    this.hallManagement = new HallManagement(this.halls);
    this.hallConfiguration = new HallConfiguration(this.halls);
    this.priceConfiguration = new PriceConfiguration(this.halls);
    this.seanceGrid = new SeanceGrid(this.halls);
    this.openSales = new OpenSales(this.halls);
  }

  initAccordeon() {
    const headers = Array.from(
      this.containerEl.querySelectorAll(".conf-step__header")
    );
    headers.forEach((header) =>
      header.addEventListener("click", () => {
        header.classList.toggle("conf-step__header_closed");
        header.classList.toggle("conf-step__header_opened");
      })
    );
  }

  async getHalls() {
    const token = localStorage.getItem('token');
    try {
      const jsonResponse = await fetch(`${_URL}hall`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      return await jsonResponse.json();
    } catch (error) {
      console.error(error);
    }
  }
}
