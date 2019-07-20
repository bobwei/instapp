/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import * as R from 'ramda';
import AsyncStorage from '@react-native-community/async-storage';

import getTimeline from '../../instagram/apis/getTimeline';
import getOwnerTimeline from '../../instagram/apis/getOwnerTimeline';

const fn = ({ isAuthenticated }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData({ setPosts });
    }
  }, [isAuthenticated]);

  return [posts, setPosts];
};

export default fn;

export const friendsKey = '@project/friends';
export const postsKey = '@project/posts';

async function loadData({ setPosts }) {
  ((await AsyncStorage.getItem(postsKey)) || Promise.resolve('{"data":[]}'))
    .then((str) => JSON.parse(str))
    .then((data) => setPosts(data.data));
  const friends = await (async () => {
    const cached = JSON.parse((await AsyncStorage.getItem(friendsKey)) || '{"data":[]}');
    const latest = await getTimeline()
      .then(R.pathOr([], ['data', 'user', 'edge_web_feed_timeline', 'edges']))
      .then(R.map(R.path(['node', 'owner', 'id'])));
    const result = [...new Set([...cached.data, ...latest])];
    AsyncStorage.setItem(friendsKey, JSON.stringify({ data: result }));
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
}
