import Page from "./Page.js";

export const _URL = "http://127.0.0.1:8000/api/";

export const _URL_ADMIN_INDEX = "/admin/src/html/index.html";

if (location.pathname === "/admin/src/html/" || location.pathname === "/admin/src/html/index.html") {

  const pageContainer = document.querySelector(".main");

  const page = new Page(pageContainer);

  page.init();
}


