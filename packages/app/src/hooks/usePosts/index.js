/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import * as R from 'ramda';

import getTimeline from '../../instagram/apis/getTimeline';
import getLocation from '../../instagram/apis/getLocation';
import getOwnerTimeline from '../../instagram/apis/getOwnerTimeline';

const fn = ({ isAuthenticated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData({ setPosts, setLocations, setIsLoading });
    }
  }, [isAuthenticated]);

  return [posts, locations, isLoading, () => loadData({ setPosts, setLocations, setIsLoading })];
};

export default fn;

export const friendsKey = '@project/friends';
export const postsKey = '@project/posts';

async function loadData({ setPosts, setLocations, setIsLoading }) {
  setIsLoading(true);
  setPosts([]);
  const friends = await (async () => {
    const latest = await getTimeline()
      .then(R.pathOr([], ['data', 'user', 'edge_web_feed_timeline', 'edges']))
      .then(R.map(R.path(['node', 'owner', 'id'])));
    const result = [...new Set(latest)];
    return result;
  })();
  const promises = [];
  for (const friend of friends) {
    const getPosts = getOwnerTimeline({ id: friend })
      .then(R.pathOr([], ['data', 'user', 'edge_owner_to_timeline_media', 'edges']))
      .then(R.map(R.pipe(R.prop('node'))))
      .then(R.reject(R.propSatisfies(R.isNil, 'location')))
      .then((posts) => {
        if (R.isEmpty(posts)) return false;
        // set posts
        setPosts((oldPosts) => [...oldPosts, ...posts]);
        // get location from posts
        const getLocationUniqId = R.uniq(R.map(R.path(['location', 'id']))(posts));
        return getLocationUniqId.map((id) => {
          return getLocation({ id })
            .then(R.path(['data', 'location']))
            .then((location) => {
              setLocations((oldLocations) => [...oldLocations, location]);
            });
        });
      });
    promises.push(getPosts);
  }
  Promise.all(promises).then(() => {
    setIsLoading(false);
  });
}
