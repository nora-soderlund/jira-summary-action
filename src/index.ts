import { getInput, setFailed, setOutput } from "@actions/core";
import { context } from "@actions/github/lib/utils";

try {
  const jiraBaseUrl = getInput("jira-base-url");
  const jiraUserEmail = getInput("jira-user-email");
  const jiraApiToken = getInput("jira-api-token");

  setOutput("title", "Hello world!");
  
  const payload = JSON.stringify(context.payload, undefined, 2);
  
  console.log(`The event payload: ${payload}`);
}
catch(error) {
  if(error instanceof Error || typeof error === "string")
    setFailed(error);
  else
    setFailed("Unknown error: " + error);
}
