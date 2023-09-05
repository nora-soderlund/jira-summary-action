# jira-summary-action
This is a GitHub Action that allows you to fetch the summary and description of a story in Jira and comment it in a pull request, together with a link to the story. This is a tool to improve developer efficieny.

![image](https://github.com/nora-soderlund/jira-summary-action/assets/78360666/f38e0d24-e8b0-43fa-a2e3-4e01aca0c9d5)

## Getting started
Add the action to your pull request workflow, which searches for Jira story keys with the project key `ABC`:
```yml
  - name: Get summary from Jira
    uses: nora-soderlund/jira-summary-action@v0.9.1
    with:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
      JIRA_USER_EMAIL: ${{ secrets.JIRA_USER_EMAIL }}
      JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
      JIRA_KEY: ABC
```

And ensure the appropriate permissions are granted:
```yml
  permissions:
    contents: read
    pull-requests: write
    issues: write
```

**Warning**, if you include a dash, e.g. `ABC-`, it will look for a story by that key as that would become a story key, or rather an invalid key.

### Example
```yml
on:
  pull_request:
    types: [ opened, reopened, edited ]

jobs:
  run-jira-summary-action:
    runs-on: ubuntu-latest
    name: Get Jira story summary
    permissions:
      contents: read
      pull-requests: write
      issues: write

    steps:
      - name: Checkout the branch
        uses: actions/checkout@v3
      
      - id: story
        name: Get summary from Jira
        uses: nora-soderlund/jira-summary-action@v0.9.1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
          JIRA_USER_EMAIL: ${{ secrets.JIRA_USER_EMAIL }}
          JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
          JIRA_KEY: ABC
      
      - name: Print the title and description
        run: echo "The title is ${{ steps.story.outputs.title }} and the description is ${{ steps.story.outputs.description }}"
```

## Reference
### Inputs
| Input | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| JIRA_BASE_URL (required) | String | - | The Jira base url |
| JIRA_USER_EMAIL (required) | String | - | The Jira user email |
| JIRA_API_TOKEN (required) | String | - | The Jira API token for the specified user email |
| | | | |
| GITHUB_TOKEN (required) | String | - | The GitHub Token to use, e.g. GITHUB_TOKEN |
| | | | |
| JIRA_KEY (required) | String | - | The project key prefix to look for - or the full story key. |
| JIRA_KEY_MULTIPLE | Boolean | false | If true and JIRA_KEY is a project key, post a comment for every story key found. |
| JIRA_PARTIAL_KEY_SILENT_FAILURE | Boolean | false | If true, not finding a story key in a pull request if a project key is specified, only throws a silent error. |
| DISABLE_PULL_REQUEST_COMMENT | Boolean | false | If true, using the action will not create or update a pull request comment. Useful for only fetching the issue details from the output. |

### Outputs
| Output | Type | Description |
| ------ | ---- | ----------- |
| title | String | If JIRA_KEY_MULTIPLE is false, the title of the linked story. |
| description | String | If JIRA_KEY_MULTIPLE is false, the description of the linked story in markdown. |

## Permissions required
| Permission | Access |
| ---------- | ------ |
| contents | read |
| pull-requests | read |
| issues | write |
