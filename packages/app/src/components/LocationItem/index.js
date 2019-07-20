import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import * as R from 'ramda';

import styles from './styles';

const Comp = ({ id, display_url, location, edge_media_to_caption, shortcode }) => {
  const caption = R.path(['edges', 0, 'node', 'text'])(edge_media_to_caption);
  return (
    <TouchableOpacity onPress={createOnPress({ shortcode })}>
      <View style={styles.container}>
        <View style={styles.info}>
          {location && (
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {location.name}
            </Text>
          )}
          <Text style={styles.caption} numberOfLines={2} ellipsizeMode="tail">
            {caption}
          </Text>
        </View>
        <Image source={{ uri: display_url }} style={styles.image} />
      </View>
    </TouchableOpacity>
  );
};

export default Comp;

function createOnPress({ shortcode }) {
  return () => {
    Linking.openURL('https://www.instagram.com/p/' + shortcode);
  };
}
