var _ = require('lodash');

var filename = process.argv[2];

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(filename)
});

var idAndAns = /^([TGE]....) \(([ABCD])\)/i;
var fig = / [Ff]igure ([0-9A-Z\-]+)/;
var quizLib = [];

var quiz = { next: 'id' };

lineReader.on('line', function (line) {
  if (quiz.next == 'id') {
    var matches = line.match(idAndAns);

    if (matches) {
      quiz.id = matches[1];
      quiz.answer = matches[2].toLowerCase();
      quiz.next = 'q';
    }
  } else if (quiz.next == 'q') {
    quiz.q = line.trim();

    var figMatches = quiz.q.match(fig);
    if (figMatches) {
      quiz.p = figMatches[1];
    }
    quiz.next = 'a';
  } else if (quiz.next == 'a') {
    if (line.substring(0, 3).toUpperCase() != 'A. ') {
      console.error('ERROR A:', quiz.id);
    }
    quiz.a = line.substring(3).trim();
    quiz.next = 'b';
  } else if (quiz.next == 'b') {
    if (line.substring(0, 3).toUpperCase() != 'B. ') {
      console.error('ERROR B:', quiz.id);
    }
    quiz.b = line.substring(3).trim();
    quiz.next = 'c';
  } else if (quiz.next == 'c') {
    if (line.substring(0, 3).toUpperCase() != 'C. ') {
      console.error('ERROR C:', quiz.id);
    }
    quiz.c = line.substring(3).trim();
    quiz.next = 'd';
  } else if (quiz.next == 'd') {
    if (line.substring(0, 3).toUpperCase() != 'D. ') {
      console.error('ERROR D:', quiz.id);
    }
    quiz.d = line.substring(3).trim();
    quiz.next = '~~';
  } else if (quiz.next == '~~') {
    if (line.substring(0, 2) != '~~') {
      console.error('ERROR ~:', quiz.id);
    }

    quizLib.push(quiz);

    quiz = { next: 'id' };
  }
}).on('close', function () {
  var idx = _.map(quizLib, function (quiz) { return quiz.id; });

  var iLib = _.map(quizLib, function (quiz) {
    var o = {};
    o.id = quiz.id;
    o.q = quiz.q;
    o.a = quiz.a;
    o.b = quiz.b;
    o.c = quiz.c;
    o.d = quiz.d;

    if (quiz.p) {
      o.p = 'FCC-' + quiz.p + '.png';
    }

    var aStr = o.a;
    o.a = o[quiz.answer];
    o[quiz.answer] = aStr;

    return o;
  });

  var lib = _.keyBy(iLib, 'id');

  var quizPool = {
    idx: idx,
    lib: lib
  };

  console.log('export default quizPool = ' + JSON.stringify(quizPool, null, 2) + ';');
});
