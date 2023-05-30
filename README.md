# SonarQube Quality Gate Commit Status

Simple JS script to pull the status report of the quality gate of a Pull Request
and set the status of the commit to failed if the quality gate failed.

## Usage

```bash
node index.js
```

## Configuration

The following environment variables are required:

* `GITHUB_TOKEN`: The GitHub token to use for the commit status.
* `PR_NUMBER`: The number of the pull request to check.
* `SHA`: The SHA of the commit add a status.
* `REPO`: The name of the repository to check.
* `OWNER`: The owner of the repository to check.
* `SONARQUBE_URL`: The URL of the SonarQube server
* `SONARQUBE_TOKEN`: The token to use to access the SonarQube server
* `SONARQUBE_PROJECT_KEY`: The key of the project to check
