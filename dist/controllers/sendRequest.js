"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const getInputToken_1 = __importDefault(require("./getInputToken"));
async function sendRequest(method, path) {
    const url = new URL(path, (0, core_1.getInput)("jira-base-url"));
    const response = await fetch(url, {
        method,
        headers: {
            "Authorization": `Bearer ${(0, getInputToken_1.default)()}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        switch (response.status) {
            case 401:
                throw new Error("Authentication credentials are incorrect or missing.");
            case 404:
                throw new Error("The requested resource does not exist.");
        }
        try {
            const body = await response.json();
            throw new Error("Something went wrong: " + response.status + response.statusText + "\n" + body);
        }
        catch {
            throw new Error("Something went wrong: " + response.status + response.statusText);
        }
    }
    return await response.json();
}
exports.default = sendRequest;
;
//# sourceMappingURL=sendRequest.js.map