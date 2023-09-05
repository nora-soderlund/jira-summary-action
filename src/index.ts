import { getInput, setFailed, setOutput } from "@actions/core";
import { getOctokit, context } from "@actions/github";
import getInputToken from "./controllers/getInputToken";
import getIssueDetails from "./controllers/issues/getIssueDetails";

//@ts-expect-error
import * as adf2md from "adf-to-md";

async function execute() {
  const jiraKey = getInput("jira-key");
  
  if(!jiraKey.includes('-'))
    throw new Error("Feature not implemented.");

  const payload = JSON.stringify(context.payload, undefined, 2);
  
  console.log(`The event payload: ${payload}`);

  const issueDetails = await getIssueDetails(jiraKey);

  const description = adf2md.convert(issueDetails.fields.description);

  setOutput("title", issueDetails.fields.summary);
  setOutput("description", description.result);

  console.log("Issue details: " + JSON.stringify(issueDetails, undefined, 2));

  if(context.payload.pull_request) {
    const octokit = getOctokit(getInput("GITHUB_TOKEN"));

    octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: context.payload.pull_request.number,
      body: [
        `## [Jira story ${issueDetails.key} summary](${getInput("jira-base-url")}/browse/${issueDetails.key})`,
        `### ${issueDetails.fields.summary}`,
        description.result
      ].join('\n')
    });
  }
};

try {
  execute();
}
catch(error) {
  if(error instanceof Error || typeof error === "string")
    setFailed(error);
  else
    setFailed("Unknown error: " + error);
}
