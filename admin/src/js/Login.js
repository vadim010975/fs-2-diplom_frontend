import { _URL, _URL_ADMIN_INDEX } from "./app.js";

export default class Login {
  constructor() {
    this.init();
  }

  init() {
    this.bindToDom();
    if (this.getTokenFromLocalStorage()) {
      this.removeToken();
    }
  }

  bindToDom() {
    this.containerEl = document.querySelector("main");
    this.loginFormEl = document.querySelector(".login__form");
    this.loginFormEl.addEventListener("submit", this.onSubmitLoginForm.bind(this));
    this.loginInputEmailEl = document.querySelector(".login__input_email");
    this.loginInputPasswordEl = document.querySelector(".login__input_password");
  }

  onSubmitLoginForm(e) {
    e.preventDefault();
    this.sendForm();
  }

  getTokenFromLocalStorage() {
   return localStorage.getItem("token");
  }

  removeToken() {
    localStorage.removeItem("token");
  }

  putTokenIntoLocalStorage(token) {
    localStorage.setItem("token", token);
  }

  async sendForm() {
    try {
      const jsonResponse  = await fetch(`${_URL}tokens/create`, {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.loginInputEmailEl.value,
            password: this.loginInputPasswordEl.value,
            device_name: "widows",
          }),
      });
      if (jsonResponse.ok) {
        const response = await jsonResponse.json();
        this.putTokenIntoLocalStorage(response.token);
        window.location.href = _URL_ADMIN_INDEX;
      }
    } catch (error) {
      console.error(error);
    }
  }
}