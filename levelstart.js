import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  TouchableHighlight,
  Text,
  View
} from 'react-native';

import Libs from './libs';
import studyRecord from './studyrecord';
import Quiz from './quiz';

export default class LevelStart extends Component {
  _pressAction(comp, libType) {
    const { navigator } = this.props;
    if (navigator) {
      if (libType == 'wrong' && this.props.context.record.wrong.size == 0) {
        Alert.alert('学霸君，没有错题可练哦！');

        return;
      }

      navigator.push({
        component: comp,
        context: {
          level: this.props.context.level,
          record: this.props.context.record,
          libType: libType
        }
      });
    }
  }

  _clearRecord() {
    this.props.context.record.quizIndex = 0;
    this.props.context.record.wrongQuizIndex = 0;
    this.props.context.record.studied = new Set();
    this.props.context.record.wrong = new Set();

    studyRecord.save(this.props.context.level, this.props.context.record);

    this.setState({});
  }

  render() {
    let level = this.props.context.level;
    let record = this.props.context.record;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          【{level.toUpperCase()}类】共{Libs[level].total}道题，考{Libs[level].quizCount}道题。
        </Text>
        <Text style={styles.instructions}>
          已经学习{record.studied.size}道题，错题库中有{record.wrong.size}道题。
        </Text>
        <View style={{flex: 1}}>
          <TouchableHighlight underlayColor='#eee' onPress={() => this._pressAction(Quiz, "study")}>
            <Text style={styles.buttonText}>
              继续学习
            </Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#eee' onPress={() => this._pressAction(Quiz, "wrong")}>
            <Text style={styles.buttonText}>
              练习错题
            </Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#eee' onPress={() => this._pressAction(Quiz, "exam")}>
            <Text style={styles.buttonText}>
              模拟考试
            </Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#eee' onPress={() => this._clearRecord()}>
            <Text style={styles.buttonText}>
              清除学习记录
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
});
