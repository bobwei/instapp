import CookieManager from 'react-native-cookies';
import * as R from 'ramda';

const fn = () => {
  // prettier-ignore
  return CookieManager
    .get('https://www.instagram.com')
    .then(R.has('sessionid'));
};

export default fn;
