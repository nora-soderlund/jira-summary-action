import * as core from "@actions/core";
import * as github from "@actions/github/lib/utils";

try {
  const jiraBaseUrl = core.getInput("jira-base-url");
  const jiraUserEmail = core.getInput("jira-user-email");
  const jiraApiToken = core.getInput("jira-api-token");

  core.setOutput("title", "Hello world!");
  
  const payload = JSON.stringify(github.context.payload, undefined, 2);

  console.log(`The event payload: ${payload}`);
}
catch(error) {
  if(error instanceof Error || typeof error === "string")
    core.setFailed(error);
  else
    core.setFailed("Unknown error: " + error);
}
