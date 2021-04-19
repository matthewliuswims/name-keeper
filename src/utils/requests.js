// Helpers
import { getHost } from "./environments";

export async function request(
  urlParam,
  {
    method = "GET",
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  } = {}
) {
  const baseURL = getHost();
  const url = `${baseURL}/api/v1${urlParam}`;
  console.log("url is", url);
  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    return response.json();
  } catch (err) {
    console.log("err with request is", err);
  }
}
