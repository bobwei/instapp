import React from 'react';
import { View, Button } from 'react-native';

import styles from './styles';
import isLogin from '../../instagram/apis/isLogin';
import logout from '../../instagram/apis/logout';

const Comp = ({ navigation }) => {
  return <View style={styles.container} />;
};

Comp.navigationOptions = ({ navigation }) => {
  const isAuthenticated = navigation.getParam('isAuthenticated');
  if (isAuthenticated === undefined) {
    isLogin().then((val) => navigation.setParams({ isAuthenticated: val }));
  }
  // prettier-ignore
  const headerRight = isAuthenticated
    ? <Button onPress={createOnLogout({ navigation })} title="Logout" />
    : <Button onPress={createOnLogin({ navigation })} title="Login" />;
  return {
    title: 'Instapp',
    headerRight,
  };
};

export default Comp;

function createOnLogout({ navigation }) {
  return () => {
    logout()
      .then(() => navigation.replace('Home'))
      .catch((res) => console.log(res.response));
  };
}

function createOnLogin({ navigation }) {
  return () => {
    navigation.navigate('Modal');
  };
}
