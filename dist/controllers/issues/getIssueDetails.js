"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendRequest_1 = __importDefault(require("../sendRequest"));
async function getIssueDetails(issue) {
    const fields = ["summary", "description"];
    return (0, sendRequest_1.default)("GET", `/rest/api/3/issue/${issue}?fields=${fields.join(',')}`);
}
exports.default = getIssueDetails;
;
//# sourceMappingURL=getIssueDetails.js.map