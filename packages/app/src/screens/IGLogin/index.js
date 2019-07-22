import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import * as R from 'ramda';

import styles from './styles';
import login from '../../instagram/apis/login';
import selectCheckOption from '../../instagram/apis/selectCheckOption';

const Comp = ({ navigation }) => {
  const [data, setData] = useState({});
  const [html, setHtml] = useState('');
  const { width } = Dimensions.get('window');
  return (
    <View style={styles.container}>
      {!html && (
        <WebView
          style={[{ width }]}
          source={{ uri: 'https://www.instagram.com/accounts/login/' }}
          injectedJavaScript={require('./injected-scripts/login').default}
          onMessage={createOnMessage({ data, setData, navigation, setHtml })}
        />
      )}
      {!!html && (
        <WebView
          style={[{ width }]}
          source={{ html }}
          injectedJavaScript=""
          onMessage={(event) => {
            console.log(event);
          }}
        />
      )}
    </View>
  );
};

Comp.navigationOptions = ({ navigation }) => {
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
  };
};

export default Comp;

function createOnMessage({ data, setData, navigation, setHtml }) {
  return (event) => {
    const input = JSON.parse(event.nativeEvent.data);
    if (input.type === 'setData') {
      setData((val) => ({ ...val, ...input.data }));
    } else if (input.type === 'submit') {
      login(data)
        .then(() => {
          navigation.navigate('Home', { isAuthenticated: true });
        })
        .catch((error) => {
          // TODO, should handle the case of security challenge
          /*
          const { response } = error;
          if (R.pathEq(['data', 'message'], 'checkpoint_required')(response)) {
            return selectCheckOption(response.data)
              .then((res) => {
                setHtml(res.data);
              })
              .catch(console.log);
          }
          */
        });
    }
  };
}
