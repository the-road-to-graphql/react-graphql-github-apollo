import React from 'react';

import Loading from '../Loading';
import { ButtonUnobtrusive } from '../Button';

import './style.css';

const FetchMore = ({
  payload,
  loading,
  pageInfo,
  doFetchMore,
}) =>
  <div className="FetchMore">
    {loading ? (
      <Loading />
    ) : (
      <ButtonUnobtrusive
        className="FetchMore-button"
        onClick={() => doFetchMore(pageInfo.endCursor, payload)}
        disabled={!pageInfo.hasNextPage}
      >
        {pageInfo.hasNextPage ? 'More' : 'No More' }
      </ButtonUnobtrusive>
    )}
  </div>

export default FetchMore;