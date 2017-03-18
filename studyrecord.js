import {AsyncStorage, Clipboard} from 'react-native';

import _ from 'lodash';

function levelToKey(level) {
  return '@hamQuiz.' + level + '.record';
}

function recordToJsonObj(record) {
  return {
    quizIndex: record.quizIndex,
    wrongQuizIndex: record.wrongQuizIndex,
    studied: [...record.studied],
    wrong: [...record.wrong]
  };
}

function JsonObjToRecord(jsonObj) {
  var result = {
    quizIndex: 0,
    wrongQuizIndex: 0,
    studied: new Set(),
    wrong: new Set()
  };

  if (jsonObj) {
    result.quizIndex = jsonObj.quizIndex ? jsonObj.quizIndex : 0;
    result.wrongQuizIndex = jsonObj.wrongQuizIndex ? jsonObj.wrongQuizIndex : 0;
    result.studied = jsonObj.studied ? new Set(jsonObj.studied) : new Set();
    result.wrong = jsonObj.wrong ? new Set(jsonObj.wrong) : new Set();
  }

  return result;
}

function load(level) {
  var result = {
    quizIndex: 0,
    wrongQuizIndex: 0,
    studied: new Set(),
    wrong: new Set()
  };

  return new Promise(
    (resolve, reject) => {
      AsyncStorage.getItem(levelToKey(level)).then((value) => {
        if (value != null) {
          var saved = JSON.parse(value);

          result = JsonObjToRecord(saved);
        }
      }).then(
        () => { resolve(result); },
        reject
      )});
}

function exportToString(levels) {
  var ps = [];

  for (var idx in levels) {
    ps.push(load(levels[idx]));
  }

  return new Promise((resolve, reject) => {
    Promise.all(ps).then(
      (results) => {
        var toBackupObj = {};

        for (var idx in levels) {
          var level = levels[idx];
          var record = recordToJsonObj(results[idx]);

          toBackupObj[level] = record;
        }

        resolve('--- HamExam Study Records BEGIN ---\n'
          + JSON.stringify(toBackupObj)
          + '\n--- HamExam Study Records END ---');
      },
      reject
    );
  });
}

function importFromString(levels, value) {
  var value = _.trim(value);
  return new Promise((resolve, reject) => {
    if (!(
      _.startsWith(value, '--- HamExam Study Records BEGIN ---\n') &&
      _.endsWith(value, '\n--- HamExam Study Records END ---'
    ))) {
      reject('Bad format!');
    } else {
      var s1 = value.substring('--- HamExam Study Records BEGIN ---\n'.length);
      var jsonStr = s1.substring(0, s1.length - '\n--- HamExam Study Records END ---'.length);

      try {
        var jsonObj = JSON.parse(jsonStr);

        var ps = [];

        for (var idx in levels) {
          var level = levels[idx];
          var record = JsonObjToRecord(jsonObj[level]);
          ps.push(save(level, record));
        }

        Promise.all(ps).then(resolve, reject);
      } catch (err) {
        reject(err);
      }
    }
  });
}

function exportToClipboard(levels) {
  return exportToString(levels).then((exported) => {
    Clipboard.setString(exported);
  });
}

function importFromClipboard(levels) {
  return new Promise((resolve, reject) => {
    Clipboard.getString().then((value) => {
      importFromString(levels, value).then(resolve, reject);
    }, reject);
  });
}

function save(level, record) {
  return AsyncStorage.setItem(levelToKey(level), JSON.stringify(recordToJsonObj(record)));
}

export default {
  load: load,
  save: save,
  exportToString: exportToString,
  exportToClipboard: exportToClipboard,
  importFromString: importFromString,
  importFromClipboard: importFromClipboard
};
