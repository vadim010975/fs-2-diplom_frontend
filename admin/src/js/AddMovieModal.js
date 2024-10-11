import { _URL } from "./app.js";
import Fetch from "./Fetch.js";

export default class AddMovieModal {
  static editMode = false;
  static movieId;
  static mainEl;
  static containerEl;
  static closeBtnEl;
  static formEl;
  static titleInputEl;
  static durationInputEl;
  static countryInputEl;
  static descriptionInputEl;
  static startDateInputEl;
  static endDateInputEl;

  static init() {
    AddMovieModal.bindToDom();
  }

  static bindToDom() {
    AddMovieModal.containerEl = document.querySelector(".modal-add-movie");
    AddMovieModal.closeBtnEl = AddMovieModal.containerEl.querySelector(
      ".modal-add-movie__btn-close"
    );
    AddMovieModal.closeBtnEl.addEventListener(
      "click",
      AddMovieModal.onClickCloseBtn
    );
    AddMovieModal.formEl = AddMovieModal.containerEl.querySelector(
      ".modal-add-movie__form"
    );
    AddMovieModal.formEl.addEventListener("submit", AddMovieModal.onSubmitForm);
    AddMovieModal.titleInputEl =
      AddMovieModal.containerEl.querySelector("#movie-title");
    AddMovieModal.durationInputEl =
      AddMovieModal.containerEl.querySelector("#movie-duration");
    AddMovieModal.countryInputEl = AddMovieModal.containerEl.querySelector("#movie-country");
    AddMovieModal.descriptionInputEl = AddMovieModal.containerEl.querySelector("#movie-description");
    AddMovieModal.startDateInputEl = AddMovieModal.containerEl.querySelector("#movie-start_date");
    AddMovieModal.endDateInputEl = AddMovieModal.containerEl.querySelector("#movie-end_date");
    AddMovieModal.btnAddImgEl = AddMovieModal.containerEl.querySelector(".modal-add-movie__btn-add-img");
    AddMovieModal.btnAddImgEl.addEventListener("click", AddMovieModal.onClickBtnAddImg);
    AddMovieModal.inputFileEl = AddMovieModal.containerEl.querySelector(".modal-add-movie__input_file");
    AddMovieModal.inputFileEl.addEventListener("change", AddMovieModal.onChangeInputFile);
    AddMovieModal.btnSubmitEl = AddMovieModal.containerEl.querySelector(".modal-add-movie__btn-submit");
  }

  static showModal() {
    AddMovieModal.containerEl.classList.remove("hidden");
    AddMovieModal.btnAddImgEl.textContent = "Добавить постер";
    if (AddMovieModal.editMode && AddMovieModal.posterURL) {
      AddMovieModal.showImage(AddMovieModal.posterURL);
      AddMovieModal.btnAddImgEl.textContent = "Изменить постер";
    }
  }

  static showImage(url) {
    const posterImgEl = document.createElement("img");
    posterImgEl.classList.add("modal-add-movie__img");
    posterImgEl.setAttribute("src", url);
    posterImgEl.setAttribute("alt", "постер");
    AddMovieModal.closeBtnEl.after(posterImgEl);
  }

  static hideImage() {
    const imgEl = AddMovieModal.containerEl.querySelector(".modal-add-movie__img");
    if (imgEl) {
      imgEl.remove();
    }
  }

  static hideModal() {
    AddMovieModal.formEl.reset();
    AddMovieModal.containerEl.classList.add("hidden");
    AddMovieModal.hideImage();
    AddMovieModal.editMode = false;
    AddMovieModal.movieId = undefined;
  }

  static onClickCloseBtn(e) {
    e.preventDefault();
    AddMovieModal.hideModal();
  }

  static onSubmitForm(e) {
    e.preventDefault();
    if (
      !isFinite(+AddMovieModal.durationInputEl.value) ||
      +AddMovieModal.durationInputEl.value <= 0
    ) {
      return;
    }
    let method;
    if (AddMovieModal.editMode) {
      method = AddMovieModal.editMovie;
    } else {
      method = AddMovieModal.addMovie;
    }
    method().then(() => {
      AddMovieModal.hideModal();
      AddMovieModal.updatePosterList();
    });
  }

  static updatePosterList() {
    const event = new CustomEvent("updatePosterList");
    document.querySelector(".main").dispatchEvent(event);
  }

  /**
   * Функция для создания нового фильма,
   * данные formData
   *
   * @static
   * @async
   * @returns {*}
   */
  static async addMovie() {
      const formData = new FormData(AddMovieModal.formEl);
      await Fetch.send("POST", "movie", { formData });
  }

  /**
   * Функция для редактирования фильма,
   * данные formData,
   * заменяются по параметру AddMovieModal.movieId
   * 
   */
  static async editMovie() {
    if (!AddMovieModal.movieId) {
      return;
    }
      const formData = new FormData(AddMovieModal.formEl);
      await Fetch.send("POST", `movie/${AddMovieModal.movieId}`, { formData, addPut: true });
  }

  static edit(movie) {
    AddMovieModal.titleInputEl.value = movie.title;
    AddMovieModal.durationInputEl.value = movie.duration;
    AddMovieModal.countryInputEl.value = movie.country;
    AddMovieModal.descriptionInputEl.value = movie.description;
    AddMovieModal.startDateInputEl.value = movie.start_date;
    AddMovieModal.endDateInputEl.value = movie.end_date;
    AddMovieModal.movieId = movie.id;
    AddMovieModal.posterURL = movie.poster_url;
    AddMovieModal.editMode = true;
    AddMovieModal.showModal();
  }

  static onClickBtnAddImg(e) {
    e.preventDefault();
    AddMovieModal.inputFileEl.dispatchEvent(new MouseEvent("click"));
  }

  static onChangeInputFile(e) {
    e.preventDefault();
    const file = AddMovieModal.inputFileEl.files && AddMovieModal.inputFileEl.files[0];
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    AddMovieModal.hideImage();
    AddMovieModal.showImage(url);
  }
}
