# Fetch GitHub Titles

Tool to fetch all titles of issues, pull requests and discussions of a GitHub repo.

## Installation

    npm install

You will need a [Personal Access Token (PAT)](https://github.com/settings/tokens) with `repo` and `read:discussion`
permissions to use this.

## Usage

    node fetch-gh-titles.js <user-or-organisation> <repo> <personal-access-token-file>