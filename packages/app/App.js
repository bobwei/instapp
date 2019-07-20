import { createStackNavigator, createAppContainer } from 'react-navigation';

const App = createAppContainer(
  createStackNavigator(
    {
      Main: {
        screen: createStackNavigator({
          Home: {
            screen: require('./src/screens/Home').default,
          },
        }),
      },
      Login: {
        screen: createStackNavigator({
          Login: {
            screen: require('./src/screens/Login').default,
          },
        }),
      },
    },
    {
      mode: 'modal',
      headerMode: 'none',
    },
  ),
);

export default App;