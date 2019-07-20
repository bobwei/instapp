import axios from 'axios';

const fn = async () => {
  const url =
    'https://www.instagram.com/graphql/query/?query_hash=08574cc2c79c937fbb6da1c0972c7b39';
  return axios.get(url).then((res) => res.data);
};

export default fn;
