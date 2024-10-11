const DELAY = 1000;

export default class Loader {
  static loaderEl;
  static endTime = 0;
  static timeId = 0;
  static start = false;

  static init() {
    const bodyEl = document.querySelector("body");
    Loader.loaderEl = document.createElement("div");
    Loader.loaderEl.classList.add("loader");
    Loader.loaderEl.style.display = "none";
    bodyEl.appendChild(Loader.loaderEl);
  }

  static startLoader() {
    if (Loader.start) {
      return;
    }
    Loader.start = true;
    Loader.renderLoader();
  }

  static stopLoader() {
    clearTimeout(Loader.timeId);
    Loader.endTime = Date.now() + DELAY - 100;
    Loader.timeId = setTimeout(() => {
      if (Date.now() > Loader.endTime) {
        clearTimeout(Loader.timeId);
        Loader.start = false;
        Loader.haideLoader();
      }
    }, DELAY);
  }

  static renderLoader() {
    Loader.loaderEl.style.display = "";
  }

  static haideLoader() {
    Loader.loaderEl.style.display = "none";
  }
}