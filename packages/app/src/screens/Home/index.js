import React, { useEffect, useRef } from 'react';
import { View, FlatList, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';

import styles from './styles';
import isLogin from '../../instagram/apis/isLogin';
import logout from '../../instagram/apis/logout';
import usePosts from '../../hooks/usePosts';
import LocationItem from '../../components/LocationItem';
import * as R from 'ramda';

const Comp = ({ navigation }) => {
  const isAuthenticated = navigation.getParam('isAuthenticated');
  const [posts, locations, isLoading, refresh] = usePosts({ isAuthenticated });
  const map = useRef();
  const locationRef = useRef(locations);
  useEffect(() => {
    const title = 'Instapp ' + (posts.length ? `(${posts.length})` : '');
    navigation.setParams({ title });
  }, [posts.length]);

  useEffect(() => {
    locationRef.current = locations;
  }, [locations.length]);

  const onViewRef = useRef((info) => {
    const { changed } = info;
    const targetId = changed[changed.length - 1].item.location.id;

    const target = R.find(R.propEq('id', targetId))(locationRef.current);

    map.current.animateToRegion(
      {
        latitude: target.lat,
        longitude: target.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      1000,
    );
  });
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(obj) => obj.id}
        renderItem={({ item }) => {
          return <LocationItem {...item} />;
        }}
        ListHeaderComponent={
          !isAuthenticated ? null : (
            <MapView
              ref={map}
              style={styles.map}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {locations.map((location) => (
                <Marker
                  key={location.id}
                  coordinate={{
                    latitude: location.lat,
                    longitude: location.lng,
                  }}
                />
              ))}
            </MapView>
          )
        }
        stickyHeaderIndices={[0]}
        // Workaround for sticky header
        // https://github.com/facebook/react-native/issues/25157
        removeClippedSubviews={Platform.OS !== 'android'}
        refreshing={isLoading}
        onRefresh={refresh}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold: 10,
          waitForInteraction: true,
        }}
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
    ? <Button onPress={createOnLogout({ navigation })} title="Logout" type="clear" />
    : <Button onPress={createOnLogin({ navigation })} title="Login" type="clear" />;
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
    navigation.navigate('IGLogin');
  };
}
