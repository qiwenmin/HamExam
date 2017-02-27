import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  TouchableHighlight,
  Text,
  Image,
  View,
  ScrollView
} from 'react-native';

import NavigationBar from 'react-native-navbar';

import _ from 'lodash';

import Libs from './libs';
import quizImgs from './quizimgs';
import studyRecord from './studyrecord';

function getExamIdx(quizIdx, count) {
  var result = new Set();

  while (result.size < count) {
    var ri = Math.floor(Math.random() * quizIdx.length);
    result.add(quizIdx[ri]);
  }

  return [...result];
}

export default class Quiz extends Component {
  constructor(props) {
    super(props);

    if (props.context.libType == 'wrong') {
      this.quizIdx = [...props.context.record.wrong];
      this.quizTotal = this.quizIdx.length;
    } else if (props.context.libType == 'exam') {
      this.quizIdx = getExamIdx(Libs[props.context.level].idx, Libs[props.context.level].quizCount);
      this.quizTotal = this.quizIdx.length;
      this.passCount = Libs[props.context.level].passCount;
    } else {
      this.quizIdx = Libs[props.context.level].idx;
      this.quizTotal = Libs[props.context.level].total;
    }
    this.quizLib = Libs.all.lib;

    this.answers = null;
    this.selectedAnswer = null;

    this.state = {
      quizIndex: props.context.libType == 'wrong' ? props.context.record.wrongQuizIndex : props.context.record.quizIndex,
      selectedAnswer: null
    };

    if (props.context.libType == 'exam') {
      this.state.quizIndex = 0;
      this.tested = new Set();
      this.wrong = new Set();
    }
  }

  setQuizIndex(idx) {
    if (idx < 0) {
      idx = 0;
    } else if (idx >= this.quizTotal) {
      idx = this.quizTotal - 1;
    }

    if (idx != this.state.quizIndex) {
      this.answers = null;

      if (this.props.context.libType == 'wrong') {
        this.props.context.record.wrongQuizIndex = idx;
      } else if (this.props.context.libType == 'study'){
        this.props.context.record.quizIndex = idx;
      }

      if (this.props.context.libType != 'exam') {
        studyRecord.save(this.props.context.level, this.props.context.record);
      }

      this.setState({
        quizIndex: idx,
        selectedAnswer: null
      });
    }
  }

  pressFirst() {
    this.setQuizIndex(0);
  }

  pressPrev() {
    this.setQuizIndex(this.state.quizIndex - 1);
  }

  pressNext() {
    this.setQuizIndex(this.state.quizIndex + 1);
  }

  pressLast() {
    this.setQuizIndex(this.quizTotal - 1);
  }

  selectAnswer(idx) {
    var isWrong = (this.answers[idx] != 'a');
    var quizId = this.quizIdx[this.state.quizIndex];

    if (isWrong) {
      this.props.context.record.wrong.add(quizId);
    }

    if (this.props.context.libType == 'exam') {
      if (isWrong && (!this.tested.has(quizId))) {
        this.wrong.add(quizId);
      }

      this.tested.add(quizId);
    } else {
      this.props.context.record.studied.add(quizId);
      studyRecord.save(this.props.context.level, this.props.context.record);
    }

    this.selectedAnswer = idx;
    this.setState({
      quizIndex: this.state.quizIndex,
      selectedAnswer: idx
    });

    if (this.props.context.libType == 'exam') {
      if (this.tested.size == this.quizTotal) {
        var correctCount = this.quizTotal - this.wrong.size;
        var passed = '考过了～👍';
        if (correctCount < this.passCount) {
          passed = '没考过～👎';
        }
        Alert.alert('测试完成！共答' + this.quizTotal + '题、答错' + this.wrong.size + '题。' + passed);
      }
    }
  }

  render() {
    let level = this.props.context.level;
    let quiz = this.quizLib[this.quizIdx[this.state.quizIndex]];
    let record = this.props.context.record;

    if (this.answers == null) {
      this.answers = _.shuffle(['a', 'b', 'c', 'd']);
    }

    var answerStyles = {
      'a': {}, 'b': {}, 'c': {}, 'd': {}
    };

    if (this.state.selectedAnswer != null) {
      answerStyles[this.answers[this.state.selectedAnswer]] = {
        backgroundColor: 'lightcoral'
      };

      answerStyles['a'] = {
        backgroundColor: 'lightgreen'
      };
    }

    var title = '';
    if (this.props.context.libType == 'study') {
      title = '学习题库';
    } else if (this.props.context.libType == 'wrong') {
      title = '练习错题';
    } else if (this.props.context.libType == 'exam') {
      title = '模拟考试';
    }

    var progressInfo = " 已学：" + record.studied.size + " | 错题：" + record.wrong.size;
    if (this.props.context.libType == 'exam') {
      progressInfo = " 已测：" + this.tested.size + " | 答错：" + this.wrong.size;
    }

    var quizImg = (<View/>);
    if (quiz.p != null) {
      var imgSrc = quizImgs[quiz.p];

      quizImg = (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{height: 180}} resizeMode="contain" source={imgSrc}/>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <NavigationBar
          title={{
            title: Libs[this.props.context.level].name + title,
            style: styles.title
          }}
          leftButton={{
            title: '<返回',
            handler: this.props.navigator.pop
          }}
        />
        <Text style={{textAlign: "center", fontSize: 12, margin: 2}}>
          {this.state.quizIndex + 1}/{this.quizTotal} |
          {progressInfo}
        </Text>

        <ScrollView style={{}}>
          <Text style={styles.q}>
            {quiz.q}
          </Text>

          {quizImg}

          <View style={{}}>
            <TouchableHighlight style={answerStyles[this.answers[0]]} underlayColor='#eee' onPress={() => this.selectAnswer(0)}>
              <Text style={styles.a}>
                A、{quiz[this.answers[0]]}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight style={answerStyles[this.answers[1]]} underlayColor='#eee' onPress={() => this.selectAnswer(1)}>
              <Text style={styles.a}>
                B、{quiz[this.answers[1]]}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight style={answerStyles[this.answers[2]]} underlayColor='#eee' onPress={() => this.selectAnswer(2)}>
              <Text style={styles.a}>
                C、{quiz[this.answers[2]]}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight style={answerStyles[this.answers[3]]} underlayColor='#eee' onPress={() => this.selectAnswer(3)}>
              <Text style={styles.a}>
                D、{quiz[this.answers[3]]}
              </Text>
            </TouchableHighlight>
          </View>
        </ScrollView>

        <View flexDirection="row" style={{alignItems: "center"}}>
          <TouchableHighlight underlayColor='#eee' onPress={() => this.pressFirst()}>
            <Text style={styles.buttonText}>
              {'<<'}开头
            </Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#eee' style={{flex: 1}} onPress={() => this.pressPrev()}>
            <Text style={styles.buttonText}>
              {'<'}上一题
            </Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#eee' style={{flex: 1}} onPress={() => this.pressNext()}>
            <Text style={styles.buttonText}>
              下一题{'>'}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#eee' onPress={() => this.pressLast()}>
            <Text style={styles.buttonText}>
              末尾{'>>'}
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  q: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 10,
  },
  a: {
    fontSize: 16,
    textAlign: 'left',
    margin: 5,
  },
  buttonText: {
    textAlign: 'center',
    margin: 10,
  },
});
