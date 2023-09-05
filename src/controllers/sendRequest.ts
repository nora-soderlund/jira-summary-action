import { getInput } from "@actions/core";
import getInputToken from "./getInputToken";

export default async function sendRequest<T = Record<string, unknown>>(method: string, path: string): Promise<T> {
  const url = new URL(path, getInput("jira-base-url"));

  const response = await fetch(url, {
    method,
    headers: {
      "Authorization": `Bearer ${getInputToken()}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  });

  if(!response.ok) {
    switch(response.status) {
      case 401:
        throw new Error("Authentication credentials are incorrect or missing.");

      case 404:
        throw new Error("The requested resource does not exist.");
    }

    try {
      const body = await response.json();

      throw new Error("Something went wrong: " + response.status + response.statusText + "\n" + body);
    }
    catch {
      throw new Error("Something went wrong: " + response.status + response.statusText);
    }    
  }

  return await response.json();
};
