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

  _exportStudyRecords() {
    studyRecord.exportToClipboard(['a', 'b', 'c', 'fccT', 'fccG', 'fccE']).then((result) => {
      Alert.alert('导出成功', '学习记录已经导出到剪贴板中。');
    }, (err) => {
      Alert.alert('出错啦！', JSON.stringify(err));
    });
  }

  _importStudyRecords() {
    studyRecord.importFromClipboard(['a', 'b', 'c', 'fccT', 'fccG', 'fccE']).then(() => {
      Alert.alert('导入成功', '学习记录已从剪贴板中导入。');
    }, (err) => {
      Alert.alert('出错啦！', '错误：' + JSON.stringify(err) + '\n\n请确认已经将以前导出的学习记录复制到剪贴板中。');
    });
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
          <TouchableHighlight underlayColor='#eee' onPress={() => this._pressLevel('fccT')}>
            <Text style={styles.buttonText}>
              【FCC-T】共{Libs.fccT.total}道题，考{Libs.fccT.quizCount}道题。
            </Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#eee' onPress={() => this._pressLevel('fccG')}>
            <Text style={styles.buttonText}>
              【FCC-G】共{Libs.fccG.total}道题，考{Libs.fccG.quizCount}道题。
            </Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#eee' onPress={() => this._pressLevel('fccE')}>
            <Text style={styles.buttonText}>
              【FCC-E】共{Libs.fccE.total}道题，考{Libs.fccE.quizCount}道题。
            </Text>
          </TouchableHighlight>
          <Text/>
          <TouchableHighlight underlayColor='#eee' onPress={() => this._exportStudyRecords()}>
            <Text style={styles.buttonText}>
              【导出学习记录】
            </Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#eee' onPress={() => this._importStudyRecords()}>
            <Text style={styles.buttonText}>
              【导入学习记录】
            </Text>
          </TouchableHighlight>

        </View>
        <TouchableHighlight underlayColor='#eee' onPress={() => {
          Alert.alert('题库',
            'A、B、C类：\n' +
            '题库版本：' + Libs.version + '\n附图版本：' + quizImgs.versionABC + '\n\n' +
            'FCC Technician: 2014-2018\n' +
            'FCC General: 2015-2019\n' +
            'FCC Extra: 2016-2020'
          );
        }}>
          <Text style={styles.copy}>
            © BG1REN, 2017 | Version: {DeviceInfo.getVersion()}
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
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  libInfo: {
    color: '#000',
    textAlign: 'center',
    fontSize: 10,
    margin: 10,
  },
  instructions: {
    color: '#000',
    textAlign: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 10,
  },
  copy: {
    textAlign: 'center',
    fontSize: 10,
  },
});
