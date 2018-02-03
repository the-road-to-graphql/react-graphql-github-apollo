import React from 'react';

import Loading from '../Loading';
import { ButtonUnobtrusive } from '../Button';

import './style.css';

const FetchMore = ({
  entry,
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
        onClick={() => doFetchMore(entry, pageInfo.endCursor)}
        disabled={!pageInfo.hasNextPage}
      >
        More
      </ButtonUnobtrusive>
    )}
  </div>

export default FetchMore;