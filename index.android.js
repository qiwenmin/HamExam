/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Navigator,
  BackAndroid,
  AppRegistry
} from 'react-native';
import Start from './start';

var _navigator = null;

export default class HamExam extends Component {
  render() {
    return (
      <Navigator initialRoute={{ component: Start, context: null }}
        configureScene={(route) => { return Navigator.SceneConfigs.FadeAndroid; }}
        renderScene={(route, navigator) => {
          _navigator = navigator;
          return <route.component context={route.context} navigator={navigator} />
        }}
      />
    );
  }
}

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1) {
    return false;
  }
  _navigator.pop();
  return true;
});

AppRegistry.registerComponent('HamExam', () => HamExam);
