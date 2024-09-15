import { _URL } from "./app.js";

export default class SeanceModal {
  static containerEl;
  static btnCloseEl;
  static btnRemoveEl;
  static seanceId;

  static init() {
    SeanceModal.bindToDom();
  }

  static bindToDom() {
    SeanceModal.containerEl = document.querySelector(".modal-seance");
    SeanceModal.btnCloseEl = SeanceModal.containerEl.querySelector(
      ".modal-seance__btn-close"
    );
    SeanceModal.btnCloseEl.addEventListener(
      "click",
      SeanceModal.onClickBtnClose
    );
    SeanceModal.btnRemoveEl = SeanceModal.containerEl.querySelector(
      ".modal-seance__btn-remove-seance"
    );
    SeanceModal.btnRemoveEl.addEventListener(
      "click",
      SeanceModal.onClickBtnRemove
    );
  }

  static showModal(seanceId) {
    SeanceModal.seanceId = seanceId;
    SeanceModal.containerEl.classList.remove("hidden");
  }

  static hideModal() {
    SeanceModal.containerEl.classList.add("hidden");
  }

  static onClickBtnClose() {
    SeanceModal.hideModal();
  }

  static onClickBtnRemove() {
    SeanceModal.removeSeance().then(() => {
      SeanceModal.hideModal();
      SeanceModal.updateHallsSeances();
    });
  }

  static updateHallsSeances() {
    const event = new CustomEvent("updateHallsSeances");
    document.querySelector(".main").dispatchEvent(event);
  }

  static async removeSeance() {
    const token = localStorage.getItem('token');
    try {
      const jsonResponse = await fetch(`${_URL}seance/${SeanceModal.seanceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}