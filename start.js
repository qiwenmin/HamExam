import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Alert
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import DeviceInfo from 'react-native-device-info';

import LevelStart from './levelstart';

import Libs from './libs';
import quizImgs from './quizimgs';
import studyRecord from './studyrecord';

export default class Start extends Component {
  _pressLevel(level) {
    const { navigator } = this.props;
    if (navigator) {
      studyRecord.load(level).then((value) => {
        navigator.push({
          component: LevelStart,
          context: {
            level: level,
            record: value
          }
        });
      }).done();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={{ title: 'Ham考试', style: styles.title }}
        />
        <Text style={styles.instructions}>
          请选择类别，开始学习或模拟考试。
        </Text>
        <View style={{flex: 1}}>
          <TouchableHighlight underlayColor='#eee' onPress={() => this._pressLevel('a')}>
            <Text style={styles.buttonText}>
              【A类】共{Libs.a.total}道题，考{Libs.a.quizCount}道题。
            </Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#eee' onPress={() => this._pressLevel('b')}>
            <Text style={styles.buttonText}>
              【B类】共{Libs.b.total}道题，考{Libs.b.quizCount}道题。
            </Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#eee' onPress={() => this._pressLevel('c')}>
            <Text style={styles.buttonText}>
              【C类】共{Libs.c.total}道题，考{Libs.c.quizCount}道题。
            </Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight underlayColor='#eee' onPress={() => {
          Alert.alert('题库',
            'A、B、C类：\n' +
            '题库版本：' + Libs.version + '\n附图版本：' + quizImgs.version);
        }}>
          <Text style={styles.copy}>
            © Qi Wenmin, 2017 | Version: {DeviceInfo.getVersion()}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  libInfo: {
    textAlign: 'center',
    fontSize: 10,
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    margin: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    margin: 10,
  },
  copy: {
    textAlign: 'center',
    fontSize: 10,
  },
});
