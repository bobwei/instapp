/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { Input } from 'react-native-elements';
import CookieManager from 'react-native-cookies';

import styles from './styles';

const Comp = ({ navigation }) => {
  const [cookie, setCookie] = useState('');
  useEffect(() => {
    navigation.setParams({ onSubmit: createOnLogin({ cookie, navigation }) });
  }, [cookie]);
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
    </View>
  );
};

Comp.navigationOptions = ({ navigation }) => {
  return {
    title: 'Login',
    headerRight: <Button title="Submit" onPress={navigation.getParam('onSubmit')} />,
  };
};

export default Comp;

function createOnLogin({ cookie, navigation }) {
  return async () => {
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
      navigation.navigate('Home', { isAuthenticated: true });
    }
  };
}