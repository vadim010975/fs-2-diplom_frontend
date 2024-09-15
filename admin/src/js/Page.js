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

  init() {
    this.initAccordeon();
    this.hallManagement = new HallManagement();
    this.hallConfiguration = new HallConfiguration();
    this.priceConfiguration = new PriceConfiguration();
    this.seanceGrid = new SeanceGrid();
    this.openSales = new OpenSales();
    getHalls();
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
}
