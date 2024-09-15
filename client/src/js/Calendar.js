import CalendarDay from "./CalendarDay.js";

export default class Calendar {
  constructor() {
    this.chosenDay = null;
    this.firstDay = new Date();
    this.onChangeDate = null;
  }

  init() {
    this.bindToDom();
    this.renderDays();
    this.onChangeDate(this.chosenDay);
  }

  bindToDom() {
    this.containerEl = document.querySelector(".page-nav");
  }

  renderDays() {
    if (this.firstDay.getTime() < (new Date()).getTime()) {
      this.firstDay = new Date();
    }
    const date = new Date(this.firstDay);
    let countDays;
    let firstDayNextGroup;
    if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
      countDays = 6;
    } else {
      countDays = 5;
    }
    const endData = new Date(date);
    endData.setDate(endData.getDate() + countDays - 1);
    if (!this.chosenDay || date.getTime() > this.chosenDay.getTime() || endData.getTime() < this.chosenDay.getTime()) {
      this.chosenDay = new Date(date); 
    }
    this.containerEl.innerHTML = "";
    for (let i = 0; i < countDays; i += 1) {
      const calendarDay = new CalendarDay(date);
      const element = calendarDay.getElement();
      if (new Date(+element.dataset.date).toLocaleDateString() === this.chosenDay.toLocaleDateString()) {
        element.classList.add("page-nav__day_chosen");
      } else {
        element.classList.remove("page-nav__day_chosen");
      }
      this.onClickElelement = this.onClickElelement.bind(this);
      element.addEventListener("click", this.onClickElelement);
      this.containerEl.appendChild(element);
      date.setDate(date.getDate() + 1);
      firstDayNextGroup = new Date(date);
    }
    const nextDaysEl = document.createElement("a");
    nextDaysEl.classList.add("page-nav__day", "page-nav__day_next");
    nextDaysEl.setAttribute("href", "#");
    nextDaysEl.addEventListener("click", this.onClickNextDays.bind(this, firstDayNextGroup));
    this.containerEl.appendChild(nextDaysEl);
    if (countDays === 5) {
      const previousDaysEl = document.createElement("a");
      previousDaysEl.classList.add("page-nav__day", "page-nav__day_previous");
      previousDaysEl.setAttribute("href", "#");
      previousDaysEl.addEventListener("click", this.onClickPreviousDays.bind(this, this.firstDay));
      this.containerEl.prepend(previousDaysEl);
    }
  }

  onClickElelement(e) {
    e.preventDefault();
    if (this.chosenDay.toLocaleDateString() === (new Date(+e.currentTarget.dataset.date)).toLocaleDateString()) {
      return;
    }
    this.chosenDay = new Date(+e.currentTarget.dataset.date);
    this.renderDays();
    this.onChangeDate(this.chosenDay);
  }

  setChosenDay(date) {
    this.chosenDay = new Date(date);
  }

  onClickNextDays(firstDay) {
    this.firstDay = firstDay;
    this.renderDays();
    this.onChangeDate(this.chosenDay);
  }

  onClickPreviousDays(argDate) {
    let startDate = new Date(argDate);
    startDate.setDate(startDate.getDate() - 6);
    if (startDate.toLocaleDateString() === (new Date()).toLocaleDateString()) {
    } else {
      startDate = new Date(argDate);
      startDate.setDate(startDate.getDate() - 5);
    }
      this.firstDay = startDate;
      this.renderDays();
      this.onChangeDate(this.chosenDay);
  }
}