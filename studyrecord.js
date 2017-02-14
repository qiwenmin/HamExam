import {AsyncStorage} from 'react-native';

function load(level) {
  var result = {
    quizIndex: 0,
    wrongQuizIndex: 0,
    studied: new Set(),
    wrong: new Set()
  };

  return new Promise(
    (resolve, reject) => {
      AsyncStorage.getItem('@hamQuiz.' + level + '.record').then((value) => {
        if (value != null) {
          var saved = JSON.parse(value);
          result.quizIndex = saved.quizIndex ? saved.quizIndex : 0;
          result.wrongQuizIndex = saved.wrongQuizIndex ? saved.wrongQuizIndex : 0;
          result.studied = saved.studied ? new Set(saved.studied) : new Set();
          result.wrong = saved.wrong ? new Set(saved.wrong) : new Set();
        }
      }).then(
        () => { resolve(result); },
        reject
      )});
}

function save(level, record) {
  return AsyncStorage.setItem('@hamQuiz.' + level + '.record', JSON.stringify({
    quizIndex: record.quizIndex,
    wrongQuizIndex: record.wrongQuizIndex,
    studied: [...record.studied],
    wrong: [...record.wrong]
  }));
}

export default {
  load: load,
  save: save
};
