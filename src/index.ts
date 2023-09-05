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
    const octokit = getOctokit(getInput("github-token"));

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

    if(existingComment) {
      const existingCommentLines = existingComment.body!.split('\n');

      let existingCommentBody: string[];

      if(existingCommentLines.find((line) => line === "---")) {
        const summaryLineIndex = existingCommentLines.findIndex((line) => line === '<summary>Previous story versions</summary>');

        existingCommentBody = [
          ...existingCommentLines.slice(1),
          "",
          ...existingCommentLines.slice(summaryLineIndex, existingCommentLines.length - 1)
        ];
      }
      else {
        const currentCommentBody = existingCommentLines.slice(1);
        currentCommentBody[0] += ` [^${issueDetails.fields.description.version - 1}]`;

        existingCommentBody = [
          ...currentCommentBody.map((line) => "> " + line),
          "",
          ...existingCommentLines.slice(1).map((line) => '> ' + line)
        ];
      }
      

      const body = [
        `## [${issueDetails.key}](${getInput("jira-base-url")}/browse/${issueDetails.key})`,
        `### ${issueDetails.fields.summary} [^${issueDetails.fields.description.version}]`,
        description.result,
        "",
        ...Array(issueDetails.fields.description.version).fill(null).map((_, index) => {
          return `[^${index + 1}]: Version ${index + 1}`;
        }),
        "",
        `<details>`,
        `<summary>Previous story versions</summary>`,
        "",
        ...existingCommentLines,
        `</details>`
      ].join('\n');

      await octokit.rest.issues.updateComment({
        ...context.repo,
        comment_id: existingComment.id,
        body: body
      });
    }
    else {
      const body = [
        `## [${issueDetails.key}](${getInput("jira-base-url")}/browse/${issueDetails.key})`,
        `### ${issueDetails.fields.summary}`,
        description.result,
        "",
        `[^${issueDetails.fields.description.version}]: Version ${issueDetails.fields.description.version}`
      ].join('\n');

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
