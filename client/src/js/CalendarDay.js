export default class CalendarDay {
  constructor(date) {
    this.date = date;
    this.element = null;
    this.daysWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  }

  createElement() {
    this.element = document.createElement("a");
    this.element.classList.add("page-nav__day");
    this.element.dataset.date = this.date.getTime();
    if (this.date.toLocaleDateString() === new Date().toLocaleDateString()) {
      this.element.classList.add("page-nav__day_today");
    }
    if (this.date.getDay() === 0 || this.date.getDay() === 6) {
      this.element.classList.add("page-nav__day_weekend");
    }
    this.element.setAttribute("href", "#");
    const dayWeekEl = document.createElement("span");
    dayWeekEl.classList.add("page-nav__day-week");
    dayWeekEl.textContent = this.daysWeek[this.date.getDay()];
    const dayNumberEl = document.createElement("span");
    dayNumberEl.classList.add("page-nav__day-number");
    dayNumberEl.textContent = this.date.getDate();
    this.element.appendChild(dayWeekEl);
    this.element.appendChild(dayNumberEl);
  }

  getElement() {
    this.createElement();
    return this.element;
  }

}