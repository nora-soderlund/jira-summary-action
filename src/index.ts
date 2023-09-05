import { getInput, setFailed, setOutput } from "@actions/core";
import { getOctokit, context } from "@actions/github";
import getIssueDetails from "./controllers/issues/getIssueDetails";

//@ts-expect-error
import * as adf2md from "adf-to-md";

const octokit = getOctokit(getInput("GITHUB_TOKEN"));

async function execute() {
  let jiraKey = getInput("JIRA_KEY");
  
  if(!jiraKey.includes('-')) {
    if(!context.payload.pull_request)
      return setFailed("Partial Jira key can only be used in pull requests!");

    const pullRequest = await octokit.rest.pulls.get({
      ...context.repo,
      pull_number: context.payload.pull_request.number,
    });

    const inputs = [
      pullRequest.data.head.ref,
      pullRequest.data.title,
      pullRequest.data.body
    ];

    const regex = new RegExp(`${jiraKey}-([0-9]{1,6})`, 'g');

    for(let input of inputs) {
      const matches = regex.exec(input ?? "");

      if(matches?.length) {
        jiraKey = matches[0];

        break;
      }
    }

    if(!jiraKey.includes('-')) {
      if(getInput("JIRA_KEY_SILENT")) {
        console.error("Failed to find a Jira key starting with " + jiraKey);

        console.info("Executing silent error because JIRA_KEY_SILENT is true.");
      }
      else
        setFailed("Failed to find a Jira key starting with " + jiraKey);

      return;
    }
  }

  console.debug("Getting the story detail from Jira...");

  const issueDetails = await getIssueDetails(jiraKey);

  const description = adf2md.convert(issueDetails.fields.description);

  setOutput("title", issueDetails.fields.summary);
  setOutput("description", description.result);

  if(context.payload.pull_request) {
    console.debug("Checking for existing story comment...");

    const comments = await octokit.rest.issues.listComments({
      ...context.repo,
      issue_number: context.payload.pull_request.number
    });

    const existingComment = comments.data.find((comment) => {
      if(!comment.body)
        return false;

      const lines = comment.body.split('\n');

      if(!lines.length)
        return false;

      if(!lines[0].startsWith(`## [${issueDetails.key}]`))
        return false;

      if(!lines[1].startsWith("###"))
        return false;

      return true;
    });

    const body = [
      `## [${issueDetails.key}](${getInput("JIRA_BASE_URL")}/browse/${issueDetails.key})`,
      `### ${issueDetails.fields.summary}`,
      description.result,
      "",
      `[^${issueDetails.fields.description.version}]: Version ${issueDetails.fields.description.version}`
    ].join('\n');

    if(existingComment) {
      console.debug("Existing comment exists for story.");

      if(existingComment.body === body) {
        console.info("Skipping updating previous comment because content is the same.");

        return;
      }

      await octokit.rest.issues.updateComment({
        ...context.repo,
        comment_id: existingComment.id,
        body
      });
    }
    else {
      console.debug("Creating a new comment with story summary...");

      await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: context.payload.pull_request.number,
        body 
      });
    }
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
