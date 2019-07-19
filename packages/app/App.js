import { createStackNavigator, createAppContainer } from 'react-navigation';

const App = createAppContainer(
  createStackNavigator({
    Home: {
      screen: require('./src/screens/Home').default,
    },
  }),
);

export default App;
