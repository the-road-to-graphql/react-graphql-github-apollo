import React from 'react';

import Loading from '../Loading';
import { ButtonUnobtrusive } from '../Button';

import './style.css';

const FetchMore = ({ children, payload, loading, pageInfo, doFetchMore }) => (
  <div className="FetchMore">
    {loading ? (
      <Loading />
    ) : (
      pageInfo.hasNextPage && (
        <ButtonUnobtrusive
          className="FetchMore-button"
          onClick={() => doFetchMore(pageInfo.endCursor, payload)}
          disabled={!pageInfo.hasNextPage}
        >
          {`More ${children}`}
        </ButtonUnobtrusive>
      )
    )}
  </div>
);

export default FetchMore;
