# Fetch GitHub Titles

Tool to fetch all titles of issues, pull requests and discussions of a GitHub repo with their numbers.
Outputs one number and title per line separated by a tab:

    1	My first Issue
    2	The PR to fix #1
    3	Discussion about some new feature request

## Installation

    npm install

You will need a [Personal Access Token (PAT)](https://github.com/settings/tokens) with `repo` and `read:discussion`
permissions to use this.

## Usage

    node fetch-gh-titles.js <user-or-organisation> <repo> <personal-access-token-file>