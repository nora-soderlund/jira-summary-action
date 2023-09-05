"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const getIssueDetails_1 = __importDefault(require("./controllers/issues/getIssueDetails"));
//@ts-expect-error
const adf2md = __importStar(require("adf-to-md"));
async function execute() {
    const jiraKey = (0, core_1.getInput)("jira-key");
    if (!jiraKey.includes('-'))
        throw new Error("Feature not implemented.");
    const payload = JSON.stringify(github_1.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
    const issueDetails = await (0, getIssueDetails_1.default)(jiraKey);
    const description = adf2md.convert(issueDetails.fields.description);
    (0, core_1.setOutput)("title", issueDetails.fields.summary);
    (0, core_1.setOutput)("description", description.result);
    console.log("Issue details: " + JSON.stringify(issueDetails, undefined, 2));
    if (github_1.context.payload.pull_request) {
        const octokit = (0, github_1.getOctokit)((0, core_1.getInput)("github-token"));
        const comments = await octokit.rest.issues.listComments({
            ...github_1.context.repo,
            issue_number: github_1.context.payload.pull_request.number
        });
        const existingComment = comments.data.find((comment) => {
            if (!comment.body)
                return false;
            const lines = comment.body.split('\n');
            if (!lines.length)
                return false;
            if (!lines[0].startsWith(`## [${issueDetails.key}]`))
                return false;
            if (!lines[1].startsWith("###"))
                return false;
            return true;
        });
        if (existingComment) {
            const existingCommentLines = existingComment.body.split('\n');
            let existingCommentBody;
            if (existingCommentLines.find((line) => line === "---")) {
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
                `## [${issueDetails.key}](${(0, core_1.getInput)("jira-base-url")}/browse/${issueDetails.key})`,
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
                ...github_1.context.repo,
                comment_id: existingComment.id,
                body: body
            });
        }
        else {
            const body = [
                `## [${issueDetails.key}](${(0, core_1.getInput)("jira-base-url")}/browse/${issueDetails.key})`,
                `### ${issueDetails.fields.summary} [^${issueDetails.fields.description.version}]`,
                description.result,
                "",
                `[^${issueDetails.fields.description.version}]: Version ${issueDetails.fields.description.version}`
            ].join('\n');
            await octokit.rest.issues.createComment({
                ...github_1.context.repo,
                issue_number: github_1.context.payload.pull_request.number,
                body
            });
        }
    }
}
;
try {
    execute();
}
catch (error) {
    if (error instanceof Error || typeof error === "string")
        (0, core_1.setFailed)(error);
    else
        (0, core_1.setFailed)("Unknown error: " + error);
}
//# sourceMappingURL=index.js.map