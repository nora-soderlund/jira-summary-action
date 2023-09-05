import { getInput, setFailed, setOutput } from "@actions/core";
import { context } from "@actions/github";
import getInputToken from "./controllers/getInputToken";
import getIssueDetails from "./controllers/issues/getIssueDetails";

try {
  const jiraKey = getInput("jira-key");

  if(!jiraKey.includes('-'))
    throw new Error("Feature not implemented.");

  const payload = JSON.stringify(context.payload, undefined, 2);
  
  console.log(`The event payload: ${payload}`);

  getIssueDetails(jiraKey).then((issueDetails) => {
    console.log("Issue details: " + JSON.stringify(issueDetails, undefined, 2));
    
    setOutput("title", "Hello world!");
  });
}
catch(error) {
  if(error instanceof Error || typeof error === "string")
    setFailed(error);
  else
    setFailed("Unknown error: " + error);
}
