import React from 'react';

import Link from '../../Link';

import '../style.css';

const Repository = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
}) => (
  <div>
    <div className="Repository-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>

      <div className={'Repository-title-action'}>
        {stargazers.totalCount} Stars
      </div>
    </div>

    <div className="Repository-description">
      <div
        className="Repository-description-info"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />
      <div className="Repository-description-details">
        <div>
          {primaryLanguage && (
            <span>Language: {primaryLanguage.name}</span>
          )}
        </div>
        <div>
          {owner && (
            <span>
              Owner: <a href={owner.url}>{owner.login}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default Repository;
