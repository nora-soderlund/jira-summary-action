"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const utils_1 = require("@actions/github/lib/utils");
try {
    const jiraBaseUrl = (0, core_1.getInput)("jira-base-url");
    const jiraUserEmail = (0, core_1.getInput)("jira-user-email");
    const jiraApiToken = (0, core_1.getInput)("jira-api-token");
    (0, core_1.setOutput)("title", "Hello world!");
    const payload = JSON.stringify(utils_1.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
}
catch (error) {
    if (error instanceof Error || typeof error === "string")
        (0, core_1.setFailed)(error);
    else
        (0, core_1.setFailed)("Unknown error: " + error);
}
