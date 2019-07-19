import axios from 'axios';
import querystring from 'query-string';
import CookieManager from 'react-native-cookies';

const fn = async (data) => {
  const { csrftoken } = await CookieManager.get('https://www.instagram.com');
  const postData = querystring.stringify({
    ...data,
    queryParams: '{"source":"auth_switcher"}',
    optIntoOneTap: true,
  });
  return axios
    .post('https://www.instagram.com/accounts/login/ajax/', postData, {
      headers: {
        'x-csrftoken': csrftoken,
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
      },
    })
    .then((response) => {
      const { authenticated } = response.data;
      if (!authenticated) {
        throw new Error('Not authenticated.');
      }
      return response;
    });
};

export default fn;
