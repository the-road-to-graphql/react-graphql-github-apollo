# A React + Apollo + GraphQL GitHub Client

[![Build Status](https://travis-ci.org/rwieruch/react-graphql-github-apollo.svg?branch=master)](https://travis-ci.org/rwieruch/react-graphql-github-apollo)

[Upcoming Courses](https://www.getrevue.co/profile/rwieruch) | [Courses](https://roadtoreact.com)

## Features

* React 16 with create-react-app
* Responsive
* React Router 4
* Apollo with GitHub GraphQL API
  * Queries and Mutations
  * Optimistic Updates
  * Pagination
  * Optimistic Fetch (e.g. Issues)
    * not everywhere for the purpose of demonstrating

## Installation

* `git clone git@github.com:rwieruch/react-graphql-github-apollo.git`
* cd react-graphql-github-apollo
* add your own [GitHub personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) in a .env file in your root folder
  * REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN=xxxXXX
* npm install
* npm start
* visit `http://localhost:3000`
