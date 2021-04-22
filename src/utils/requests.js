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

  const bodyStringified = JSON.stringify(body);
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: bodyStringified,
    });

    const body = await response.json();
    return {
      body,
      status: response.status,
      ok: response.ok,
    };
  } catch (err) {
    console.log("err with request is", err);
  }
}
