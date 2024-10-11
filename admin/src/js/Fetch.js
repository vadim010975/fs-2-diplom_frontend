import { _URL } from "./app.js";
import Loader from "./Loader.js";

export default class Fetch {
  static async send(method, query, options = {}) {
    Loader.startLoader();
    const token = localStorage.getItem("token");
    try {
      const requestOptions = {
        method,
        headers: { Authorization: `Bearer ${token}` },
      };
      if (options?.formData) {
        if (options?.addPut) {
          options.formData.append("_method", "PUT");
        }
        requestOptions.body = options.formData;
      }
      if (options?.bodyJson) {
        requestOptions.body = JSON.stringify(options.bodyJson);
        requestOptions.headers["Content-Type"] = "application/json";
      }
      const response = await fetch(_URL + query, requestOptions);
      if (options?.cleanResponse) {
        Loader.stopLoader();
        return response;
      }
      if (response.headers.get("content-type") === "application/json") {
        Loader.stopLoader();
        return await response.json();
      }
      if (
        response.headers.get("content-type") &&
        response.headers.get("content-type").includes("text/plain")
      ) {
        Loader.stopLoader();
        return await response.text();
      }
      Loader.stopLoader();
    } catch (error) {
      console.error(error);
    }
  }
}
