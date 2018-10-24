# A React + Apollo + GraphQL GitHub Client

[![Build Status](https://travis-ci.org/the-road-to-graphql/react-graphql-github-apollo.svg?branch=master)](https://travis-ci.org/the-road-to-graphql/react-graphql-github-apollo) [![Slack](https://slack-the-road-to-learn-react.wieruch.com/badge.svg)](https://slack-the-road-to-learn-react.wieruch.com/) [![Greenkeeper badge](https://badges.greenkeeper.io/the-road-to-graphql/react-graphql-github-apollo.svg)](https://greenkeeper.io/)

<img src="https://user-images.githubusercontent.com/2479967/35777369-14a2d1ae-09ad-11e8-80c6-7a3ddeabb716.gif" width="300" />

## Features

* React 16 with create-react-app
* Responsive
* React Router 4
* Apollo with GitHub GraphQL API
  * Queries and Mutations with render props
  * Optimistic Updates
  * Pagination
  * Optimistic Fetch (e.g. Issues)
    * not everywhere for the purpose of demonstrating though

## Installation

* `git clone git@github.com:the-road-to-graphql/react-graphql-github-apollo.git`
* cd react-graphql-github-apollo
* add your own [GitHub personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) in a .env file in your root folder
  * scopes/permissions you need to check: admin:org, repo, user, notifications
  * REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN=xxxXXX
* npm install
* npm start
* visit `http://localhost:3000`

## Contributing

* Please install [Prettier integration](https://prettier.io/docs/en/editors.html) to your editor and turn on **format on save** option.
  * [Prettier For Atom](https://github.com/prettier/prettier-atom)
  * [Prettier for VSCode](https://github.com/prettier/prettier-vscode)
  * [Prettier for EMACS](https://github.com/prettier/prettier-emacs)
  * [Prettier for VIM](https://prettier.io/docs/en/vim.html)
  * [others...](https://prettier.io/docs/en/editors.html)

## Want to learn more about React + GraphQL + Apollo?

* Don't miss [upcoming Tutorials and Courses](https://www.getrevue.co/profile/rwieruch)
* Check out current [React Courses](https://roadtoreact.com)
