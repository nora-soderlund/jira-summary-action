import { getInput } from "@actions/core";
import getInputToken from "../getInputToken";
import sendRequest from "../sendRequest";

export type GetIssueDetailsResponse = {
  attachment: {
    id: number;
    self: string;
    filename: string;
    author: {
      self: string;
      key: string;
      accountId: string;
      name: string;
      avatarUrls: {
        "16x16": string;
        "24x24": string;
        "32x32": string;
        "48x48": string;
      };
      displayName: string;
      active: boolean;
    };
    created: string;
    size: number;
    mimeType: string;
    content: string;
    thumbnail: string;
  }[];

  "sub-tasks": {
    id: string;
    type: {
      id: string;
      name: string;
      inward: string;
      outward: string;
    };
    outwardIssue: {
      id: string;
      key: string;
      self: string;
      fields: {
        status: {
          iconUrl: string;
          name: string;
        };
      };
    }
  }[];

  description: {
    type: string;
    version: number;
    content: {
      type: string;
      content: {
        type: string;
        text: string;
      }[];
    }[];
  }
};

export type GetIssueDetailsParameters = {
  fields?: string[];
};

export default async function getIssueDetails(issue: string): Promise<GetIssueDetailsResponse> {
  const fields = [ "summary", "description" ];

  return sendRequest("GET", `/rest/api/3/issue/${issue}?fields=${fields.join(',')}`);
};
