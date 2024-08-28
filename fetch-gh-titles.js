#!/usr/bin/env node
import { graphql } from "@octokit/graphql";
import fs from 'fs';


if (process.argv.length < 5) {
  console.log('Usage: node ' + process.argv[1] + ' <user-or-organisation> <repo> <personal-access-token-file>');
  process.exit(1);
}

const owner = process.argv[2];
const repo = process.argv[3];
const keyFile = process.argv[4];

const authKey = fs.readFileSync(keyFile, 'utf8');

async function fetchDiscussionTitles(owner, repo) {
    const query = `
    query($owner: String!, $repo: String!, $issuesCursor: String, $prsCursor: String, $discussionsCursor: String) {
      repository(owner: $owner, name: $repo) {
        issues(first: 100, after: $issuesCursor) {
          edges {
            node {
              title
              number
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
        pullRequests(first: 100, after: $prsCursor) {
          edges {
            node {
              title
              number
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
        discussions(first: 100, after: $discussionsCursor) {
          edges {
            node {
              title
              number
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  `;

  let hasNextIssuesPage = true;
  let hasNextPRsPage = true;
  let hasNextDiscussionsPage = true;
  let issuesCursor = null;
  let prsCursor = null;
  let discussionsCursor = null;
  let issues = [];
  let prs = [];
  let discussions = [];

  while (hasNextIssuesPage || hasNextPRsPage || hasNextDiscussionsPage) {
    const response = await graphql({
      query,
      owner,
      repo,
      issuesCursor,
      prsCursor,
      discussionsCursor,
      headers: {
        authorization: `token ${authKey}`
      }
    });

    if (hasNextIssuesPage) {
      const fetchedIssues = response.repository.issues.edges.map(edge => `${edge.node.number}\t${edge.node.title}`);
      issues.push(...fetchedIssues);
      hasNextIssuesPage = response.repository.issues.pageInfo.hasNextPage;
      issuesCursor = response.repository.issues.pageInfo.endCursor;
    }

    if (hasNextPRsPage) {
      const fetchedPRs = response.repository.pullRequests.edges.map(edge => `${edge.node.number}\t${edge.node.title}`);
      prs.push(...fetchedPRs);
      hasNextPRsPage = response.repository.pullRequests.pageInfo.hasNextPage;
      prsCursor = response.repository.pullRequests.pageInfo.endCursor;
    }

    if (hasNextDiscussionsPage) {
      const fetchedDiscussions = response.repository.discussions.edges.map(edge => `${edge.node.number}\t${edge.node.title}`);
      discussions.push(...fetchedDiscussions);
      hasNextDiscussionsPage = response.repository.discussions.pageInfo.hasNextPage;
      discussionsCursor = response.repository.discussions.pageInfo.endCursor;
    }
  }

  return { issues, prs, discussions };
}

const all = await fetchDiscussionTitles(owner, repo);
all.issues.forEach(d => console.log(d));
all.prs.forEach(d => console.log(d));
all.discussions.forEach(d => console.log(d));
