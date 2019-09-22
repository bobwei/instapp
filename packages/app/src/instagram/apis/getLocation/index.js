import axios from 'axios';

const fn = async ({ id }) => {
  const url = `https://www.instagram.com/graphql/query/?query_hash=1b84447a4d8b6d6d0426fefb34514485&variables={"id":"${id}","first":12}`;
  return axios.get(url).then((res) => res.data);
};

export default fn;
