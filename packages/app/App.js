import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import IGLogin from '@bobwei/instagram-api/lib/components/IGLogin';

const App = createAppContainer(
  createStackNavigator({
    Home: {
      screen: require('./src/screens/Home').default,
    },
    IGLogin: {
      screen: ({ navigation }) => <IGLogin onSuccess={() => navigation.pop()} />,
    },
  }),
);

export default App;
