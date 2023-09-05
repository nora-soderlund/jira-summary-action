import { getInput } from "@actions/core";

export default function getInputToken() {
  const jiraUserEmail = getInput("jira-user-email");
  const jiraApiToken = getInput("jira-api-token");

  return Buffer.from(`${jiraUserEmail}:${jiraApiToken}`).toString("base64url");
};
