require("dotenv").config()
const axios = require('axios');
const { Octokit } = require("@octokit/rest");

const github_token = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: github_token });

const prNumber = process.env.PR_NUMBER;
const owner = process.env.OWNER;
const repo = process.env.REPO;
const sha = process.env.SHA;
const sonarqubeToken = process.env.SONARQUBE_TOKEN;
let sonarqubeUrl = process.env.SONARQUBE_URL;
if (sonarqubeUrl.endsWith('/')) {
    sonarqubeUrl = sonarqubeUrl.slice(0, -1);
}

const projectKey = process.env.SONARQUBE_PROJECT_KEY;
const statusContext = 'SonarQube Quality Gate';

sonarqubeReportSuccess = async () => {
    return axios.get(
        `${sonarqubeUrl}/api/qualitygates/project_status`,
            {
                params: {
                    projectKey,
                    pullRequest: prNumber
                },
                auth: {
                    username: sonarqubeToken,
                    password: "",
                },
            }
    ).then((response) => {
        return response.data.projectStatus.status !== 'ERROR'
    }).catch(error => console.log(error));
}

// Can be one of: error, failure, pending, success
createCommitStatus = (sonarQubeReportSuccess) => {
    let state = 'success';
    let description = 'Successful';
    const targetUrl = `${sonarqubeUrl}/dashboard?id=${projectKey}&pullRequest=${prNumber}`;

    if (!sonarQubeReportSuccess) {
        state = 'failure';
        description = 'Failed';
    }

    octokit.rest.repos.createCommitStatus({
        owner,
        repo,
        sha,
        state,
        description,
        target_url: targetUrl,
        context: statusContext
    }).catch(error => console.log(error));
}

main = async () => {
    const reportStatus = await sonarqubeReportSuccess();
    await createCommitStatus(reportStatus);
}

main();
