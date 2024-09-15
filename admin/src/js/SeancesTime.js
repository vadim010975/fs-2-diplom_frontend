import { _URL } from "./app.js";

export default class SeancesTime {
  constructor(hallId, movie) {
    this.hallId = hallId;
    this.movieId = movie.id;
    this.movieDuration = +movie.duration;
    this.seances = [];
    this.availableTime = [];
    this.init();
  }

  init() {
    this.availableTime = SeancesTime.initSampleAvailableTime();

  }

  async getAvailableTime() {
    await this.getSeances().then(() => {
      this.calculateAvailableTime();
    });
    return {
      availableTime: this.availableTime,
      strings: this.getAvailableTimeStrings(),
    }
  }

  static initSampleAvailableTime() {
    const time = [];
    for (let i = 0; i < 24; i += 1) {
      const minutes = [];
      for (let j = 0; j < 60; j += 10) {
        minutes.push(j);
      }
      time.push(minutes);
    }
    return time;
  }

  async getSeances() {
    const token = localStorage.getItem('token');
    try {
      const jsonResponse = await fetch(`${_URL}hall/${this.hallId}/seances`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await jsonResponse.json();
      this.seances = response;
    } catch (error) {
      console.error(error);
    }
  }

  calculateAvailableTime() {
    const timeBoundaries = this.getTimeBoundaries();
    this.availableTime.forEach((hour, idxHour) => {
      hour.forEach((minutes, idxMinutes) => {
        timeBoundaries.forEach((timeBoundarie) => {
          if (
            idxHour >= timeBoundarie.startingHour &&
            idxHour <= timeBoundarie.endingHour
          ) {
            if (
              idxHour === timeBoundarie.startingHour &&
              idxHour != timeBoundarie.endingHour
            ) {
              if (minutes >= timeBoundarie.startingMinutes) {
                delete hour[idxMinutes];
              }
            }
            if (
              idxHour > timeBoundarie.startingHour &&
              idxHour < timeBoundarie.endingHour
            ) {
              delete hour[idxMinutes];
            }
            if (
              idxHour != timeBoundarie.startingHour &&
              idxHour === timeBoundarie.endingHour
            ) {
              if (minutes <= timeBoundarie.endingMinutes) {
                delete hour[idxMinutes];
              }
            }
            if (
              idxHour === timeBoundarie.startingHour &&
              idxHour === timeBoundarie.endingHour
            ) {
              if (
                minutes >= timeBoundarie.startingMinutes &&
                minutes <= timeBoundarie.endingMinutes
              ) {
                delete hour[idxMinutes];
              }
            }
          }
          if (timeBoundarie.startingHour > timeBoundarie.endingHour) {
            if (idxHour >= timeBoundarie.startingHour && idxHour <= 23) {
              if (idxHour === timeBoundarie.startingHour) {
                if (minutes >= timeBoundarie.startingMinutes) {
                  delete hour[idxMinutes];
                }
              }
              if (idxHour > timeBoundarie.startingHour) {
                delete hour[idxMinutes];
              }
            }
            if (idxHour >= 0 && idxHour <= timeBoundarie.endingHour) {
              if (idxHour === timeBoundarie.endingHour) {
                if (minutes <= timeBoundarie.endingMinutes) {
                  delete hour[idxMinutes];
                }
              }
              if (idxHour < timeBoundarie.endingHour) {
                delete hour[idxMinutes];
              }
            }
          }
        });
      });
    });
    // с учетом длины фильма
    let counter = 0;
    let isStart = false;
    for (let i = this.availableTime.length - 1; i >= 0; i -= 1) {
      for (let j = this.availableTime[i].length - 1; j >= 0; j -= 1) {
        if (this.availableTime[i][j] || this.availableTime[i][j] === 0) {
          if (isStart === true) {
            if (counter < this.movieDuration) {
              delete this.availableTime[i][j]
            }
            counter += 10;
          }
        } else {
          counter = 0;
          isStart = true;
        }
      }
    }
  }

  getTimeBoundaries() {
    const timeBoundaries = [];
    const hoursDuration = Math.trunc(this.movieDuration / 60);
    const minutesDuration = this.movieDuration % 60;
    this.seances.forEach((seance) => {
      const colonIdx = seance.start.indexOf(":");
      const startingHour = +seance.start.slice(0, colonIdx);
      const startingMinutes = +seance.start.slice(colonIdx + 1);
      let correction = 0;
      let endingMinutes = startingMinutes + minutesDuration;
      if (endingMinutes >= 60) {
        endingMinutes -= 60;
        correction = 1;
      }
      let endingHour = startingHour + hoursDuration + correction;
      if (endingHour >= 24) {
        endingHour -= 24;
      }
      timeBoundaries.push({
        startingHour,
        startingMinutes,
        endingHour,
        endingMinutes,
      });
    });
    return timeBoundaries;
  }

  getAvailableTimeStrings() {
    let startValue;
    let endValue;
    let isStart = false;
    const availableTime = [];
    for (let i = 0; i < this.availableTime.length; i += 1) {
      for (let j = 0; j < this.availableTime[i].length; j += 1) {
        if (this.availableTime[i][j] || this.availableTime[i][j] === 0) {
          if (this.availableTime[i][j] === 0) {
            this.availableTime[i][j] = "00";
          }
          if (!isStart) {
            isStart = true;
            if (i < 10) {
              startValue = `0${i}:${this.availableTime[i][j]}`;
            } else {
              startValue = `${i}:${this.availableTime[i][j]}`;
            }
          }
          if (i < 10) {
            endValue = `0${i}:${this.availableTime[i][j]}`;
          } else {
            endValue = `${i}:${this.availableTime[i][j]}`;
          }
        } else {
          if (isStart) {
            availableTime.push(`с ${startValue} по ${endValue}`);
          }
          isStart = false;
        }
      }
    }
    if (isStart) {
      availableTime.push(`с ${startValue} по ${endValue}`);
    }
    return availableTime;
  }
}
