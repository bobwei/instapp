import React from 'react';
import { View } from 'react-native';

import styles from './styles';

const Comp = () => {
  return <View style={styles.container} />;
};

Comp.navigationOptions = {
  title: 'Instapp',
};

export default Comp;
