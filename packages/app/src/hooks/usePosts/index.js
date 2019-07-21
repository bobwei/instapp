/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import * as R from 'ramda';

import getTimeline from '../../instagram/apis/getTimeline';
import getOwnerTimeline from '../../instagram/apis/getOwnerTimeline';

const fn = ({ isAuthenticated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData({ setPosts, setIsLoading });
    }
  }, [isAuthenticated]);

  return [posts, isLoading, () => loadData({ setPosts, setIsLoading })];
};

export default fn;

export const friendsKey = '@project/friends';
export const postsKey = '@project/posts';

async function loadData({ setPosts, setIsLoading }) {
  setIsLoading(true);
  const friends = await (async () => {
    const latest = await getTimeline()
      .then(R.pathOr([], ['data', 'user', 'edge_web_feed_timeline', 'edges']))
      .then(R.map(R.path(['node', 'owner', 'id'])));
    const result = [...new Set(latest)];
    return result;
  })();
  const posts = [];
  for (const friend of friends) {
    const result = await getOwnerTimeline({ id: friend })
      .then(R.pathOr([], ['data', 'user', 'edge_owner_to_timeline_media', 'edges']))
      .then(R.map(R.pipe(R.prop('node'))))
      .then(R.reject(R.propSatisfies(R.isNil, 'location')));
    posts.push(...result);
    setPosts([...posts]);
  }
  setIsLoading(false);
}
