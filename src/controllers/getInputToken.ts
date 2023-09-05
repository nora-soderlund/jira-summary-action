import { getInput } from "@actions/core";

export default function getInputToken() {
  const jiraUserEmail = getInput("JIRA_USER_EMAIL");
  const jiraApiToken = getInput("JIRA_API_KEY");

  return Buffer.from(`${jiraUserEmail}:${jiraApiToken}`).toString("base64url");
};
