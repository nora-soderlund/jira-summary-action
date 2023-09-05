import { getInput } from "@actions/core";
import getInputToken from "../getInputToken";
import sendRequest from "../sendRequest";

export type GetIssueDetailsParameters = {
  fields?: string[];
};

export default async function getIssueDetails(issue: string) {
  const fields = [ "summary", "description" ];

  return sendRequest("GET", `/rest/api/3/issue/${issue}?fields=${fields.join(',')}`);
};
