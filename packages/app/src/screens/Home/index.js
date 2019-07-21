import React, { useEffect } from 'react';
import { View, Button, FlatList } from 'react-native';

import styles from './styles';
import isLogin from '../../instagram/apis/isLogin';
import logout from '../../instagram/apis/logout';
import usePosts from '../../hooks/usePosts';
import LocationItem from '../../components/LocationItem';

const Comp = ({ navigation }) => {
  const isAuthenticated = navigation.getParam('isAuthenticated');
  const [posts, isLoading, refresh] = usePosts({ isAuthenticated });
  useEffect(() => {
    const title = 'Instapp ' + (posts.length ? `(${posts.length})` : '');
    navigation.setParams({ title });
  }, [posts.length]);
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(obj) => obj.id}
        renderItem={({ item }) => {
          return <LocationItem {...item} />;
        }}
        refreshing={isLoading}
        onRefresh={refresh}
      />
    </View>
  );
};

Comp.navigationOptions = ({ navigation }) => {
  const isAuthenticated = navigation.getParam('isAuthenticated');
  if (isAuthenticated === undefined) {
    isLogin().then((val) => navigation.setParams({ isAuthenticated: val }));
  }
  const title = navigation.getParam('title');
  // prettier-ignore
  const headerRight = isAuthenticated
    ? <Button onPress={createOnLogout({ navigation })} title="Logout" />
    : <Button onPress={createOnLogin({ navigation })} title="Login" />;
  return {
    title,
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
    navigation.navigate('Login');
  };
}
