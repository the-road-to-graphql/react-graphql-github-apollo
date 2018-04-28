import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import { mount } from 'enzyme';
import {
  createApolloClient,
  injectSpyInMutation,
} from 'react-apollo-async-testing';

import '../../test-setup';

import Repository from './';
import { WATCH_REPOSITORY } from '../mutations';

let client;
let sinonSpy;

beforeAll(() => {
  client = createApolloClient('https://api.github.com/graphql');

  sinonSpy = injectSpyInMutation();
});

test('interaction with mutation function from the Mutation component', () => {
  const repository = {
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
  };

  const wrapper = mount(
    <ApolloProvider client={client}>
      <Repository {...repository} />
    </ApolloProvider>,
  );

  expect(
    wrapper.find('button[data-test-id="updateSubscription"]').text(),
  ).toEqual(`${repository.watchers.totalCount} Watch`);

  wrapper
    .find('button[data-test-id="updateSubscription"]')
    .simulate('click');

  expect(sinonSpy.calledOnce).toEqual(true);

  const expectedObject = {
    mutation: WATCH_REPOSITORY,
    variables: {
      id: repository.id,
      viewerSubscription: 'SUBSCRIBED',
    },
  };

  expect(sinonSpy.calledWith(expectedObject)).toEqual(true);
});
