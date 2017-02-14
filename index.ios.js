/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Navigator,
  AppRegistry
} from 'react-native';
import Start from './start';

export default class HamExam extends Component {
  render() {
    return (
      <Navigator initialRoute={{ component: Start, context: null }}
        renderScene={(route, navigator) => {
          return <route.component context={route.context} navigator={navigator} />
        }}
      />
    );
  }
}

AppRegistry.registerComponent('HamExam', () => HamExam);
