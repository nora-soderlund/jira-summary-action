"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
function getInputToken() {
    const jiraUserEmail = (0, core_1.getInput)("jira-user-email");
    const jiraApiToken = (0, core_1.getInput)("jira-api-token");
    return Buffer.from(`${jiraUserEmail}:${jiraApiToken}`).toString("base64url");
}
exports.default = getInputToken;
;
//# sourceMappingURL=getInputToken.js.map