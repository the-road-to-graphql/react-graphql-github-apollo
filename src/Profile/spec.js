import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import { mount } from 'enzyme';
import {
  createApolloClient,
  stubQueryWith,
} from 'react-apollo-async-testing';

import '../test-setup';

import Profile from './';
import { GET_REPOSITORIES_OF_CURRENT_USER } from './queries';

let client;
let promise;

const viewerWithRepositories = {
  viewer: {
    name: 'Robin Wieruch',
    repositories: {
      edges: [
        {
          node: {
            id: '1',
            name: 'bar',
            url: 'https://bar.com',
            descriptionHTML: '',
            primaryLanguage: {
              name: 'JavaScript',
            },
            owner: {
              login: 'rwieruch',
              url: 'https://bar',
            },
            stargazers: {
              totalCount: 2,
            },
            viewerHasStarred: true,
            watchers: {
              totalCount: 2,
            },
            viewerSubscription: 'UNSUBSCRIBED',
          },
        },
        {
          node: {
            id: '2',
            name: 'qwe',
            url: 'https://qwe.com',
            descriptionHTML: '',
            primaryLanguage: {
              name: 'JavaScript',
            },
            owner: {
              login: 'rwieruch',
              url: 'https://bar',
            },
            stargazers: {
              totalCount: 2,
            },
            viewerHasStarred: true,
            watchers: {
              totalCount: 2,
            },
          },
        },
      ],
      pageInfo: {
        endCursor: '2',
        hasNextPage: false,
      },
    },
  },
};

beforeAll(() => {
  promise = stubQueryWith(
    'https://api.github.com/graphql',
    {
      query: GET_REPOSITORIES_OF_CURRENT_USER,
    },
    viewerWithRepositories,
  );

  client = createApolloClient('https://api.github.com/graphql');
});

afterAll(() => {
  // since the fetch API is stubbed with the library
  // it has to be restored after the tests
  fetch.restore();
});

test('query result of Query component', done => {
  const wrapper = mount(
    <ApolloProvider client={client}>
      <Profile />
    </ApolloProvider>,
  );

  expect(wrapper.find('Loading')).toHaveLength(1);

  promise.then().then(() => {
    setImmediate(() => {
      wrapper.update();

      expect(wrapper.find('RepositoryList')).toHaveLength(1);

      done();
    });
  });
});
