/* eslint-disable no-alert */
import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { Input, Button } from 'react-native-elements';

import styles from './styles';
import login from '../../instagram/apis/login';

const Comp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View style={styles.container}>
      <Input
        label="Username"
        containerStyle={styles.section}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
      />
      <Input
        label="Password"
        containerStyle={styles.section}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button
        style={styles.section}
        title={!isLoading ? 'Submit' : 'Loading...'}
        type="solid"
        onPress={createOnLogin({
          username,
          password,
          navigation,
          setIsLoading,
        })}
      />
    </View>
  );
};

Comp.navigationOptions = ({ navigation }) => {
  // prettier-ignore
  const headerRight = Platform.OS === 'ios'
    ? <Button
        title="Cookie"
        onPress={() => {
          navigation.navigate('CookieLogin');
        }}
        type="clear"
      />
    : null;
  return {
    title: 'Login',
    headerLeft: (
      <Button
        title="Back"
        onPress={() => {
          navigation.pop();
        }}
        type="clear"
      />
    ),
    headerRight,
  };
};

export default Comp;

function createOnLogin({ username, password, navigation, setIsLoading }) {
  return () => {
    setIsLoading(true);
    login({ username, password })
      .then(() => {
        setIsLoading(false);
        navigation.navigate('Home', { isAuthenticated: true });
      })
      .catch((error) => {
        setIsLoading(false);
        alert(error);
      });
  };
}
