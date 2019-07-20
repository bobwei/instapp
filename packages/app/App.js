import { createStackNavigator, createAppContainer } from 'react-navigation';

const App = createAppContainer(
  createStackNavigator({
    Home: {
      screen: require('./src/screens/Home').default,
    },
    Modal: {
      screen: createStackNavigator(
        {
          Login: {
            screen: require('./src/screens/Login').default,
          },
        },
        {
          mode: 'modal',
          headerMode: 'none',
          navigationOptions: { title: 'Login' },
        },
      ),
    },
  }),
);

export default App;
