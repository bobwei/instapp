/* eslint-disable no-alert */
import React, { useState } from 'react';
import { View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import CookieManager from 'react-native-cookies';

import styles from './styles';

const Comp = ({ navigation }) => {
  const [cookie, setCookie] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View style={styles.container}>
      <Input
        label="Cookie"
        containerStyle={styles.section}
        value={cookie}
        onChangeText={setCookie}
        placeholder="Cookie"
        autoCapitalize="none"
        multiline
      />
      <Button
        style={styles.section}
        title={!isLoading ? 'Submit' : 'Loading...'}
        type="solid"
        onPress={createOnLogin({
          cookie,
          navigation,
          setIsLoading,
        })}
      />
    </View>
  );
};

Comp.navigationOptions = ({ navigation }) => {
  return {
    title: 'Login',
  };
};

export default Comp;

function createOnLogin({ cookie, navigation, setIsLoading }) {
  return async () => {
    setIsLoading(true);
    const lines = cookie.split('\n');
    for (const line of lines) {
      const [domain, , , , expiration, name, value] = line.split('	');
      if (domain.startsWith('#')) {
        continue;
      }
      // prettier-ignore
      await CookieManager
        .set({
          name,
          value,
          domain,
          origin: domain,
          path: '/',
          version: '1',
          expiration: new Date(expiration * 1000).toISOString(),
        })
        .catch(error => {
          alert(error);
        });
      setIsLoading(false);
      navigation.navigate('Home', { isAuthenticated: true });
    }
  };
}
