"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const getIssueDetails_1 = __importDefault(require("./controllers/issues/getIssueDetails"));
try {
    const jiraKey = (0, core_1.getInput)("jira-key");
    if (!jiraKey.includes('-'))
        throw new Error("Feature not implemented.");
    const payload = JSON.stringify(github_1.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
    (0, getIssueDetails_1.default)(jiraKey).then((issueDetails) => {
        console.log("Issue details: " + JSON.stringify(issueDetails, undefined, 2));
        (0, core_1.setOutput)("title", "Hello world!");
    });
}
catch (error) {
    if (error instanceof Error || typeof error === "string")
        (0, core_1.setFailed)(error);
    else
        (0, core_1.setFailed)("Unknown error: " + error);
}
//# sourceMappingURL=index.js.map