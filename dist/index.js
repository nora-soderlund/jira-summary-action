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
try {
    const jiraKey = (0, core_1.getInput)("jira-key");
    if (!jiraKey.includes('-'))
        throw new Error("Feature not implemented.");
    const payload = JSON.stringify(github_1.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
    (0, getIssueDetails_1.default)(jiraKey).then((issueDetails) => {
        console.log("Issue details: " + JSON.stringify(issueDetails, undefined, 2));
        const description = adf2md.convert(issueDetails.description);
        console.log("Markdown: " + description);
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