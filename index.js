
let request = require('request');

let url1 = 'https://hola.org/challenges/haggling/scores/standard';
let url2 = 'https://hola.org/challenges/haggling/scores/standard_1s';
let url3 = 'https://hola.org/challenges/haggling/scores/large';
let url4 = 'https://hola.org/challenges/haggling/scores/large_1s';

// > stats Options: [day, topX, minimumSessions, url]
// day : string format '2018-07-20'
// topX : number, top x best score averages (e.g. 10)
// minimumSessions : number , minimum of sessions for not that bad statistics
// url: string, url of the arena's json
let options = ['2018-07-20', 10, 300, url2];


let id = '01a48ec1e1c3668a7f55f401efc53388';

function stats(jsonBody, options) {
  console.log('______________\nDay ' + options[0]);
  console.log('Arena: ' + options[3].replace('https://hola.org/challenges/haggling/scores/', '') + '\n');

  let allDayParticipants = [];
  let allDayParticipantsSessions = [];

  for (let participant in jsonBody) {
    for (let day in jsonBody[participant]) {
      if (day === options[0] && jsonBody[participant][day]['sessions'] > options[2]) {
        allDayParticipants.push(participant);
        allDayParticipantsSessions.push(jsonBody[participant][day]);
        if (participant === id) {
          console.log('> My score: ' + (jsonBody[participant][day]['score'] / jsonBody[participant][day]['sessions']).toFixed(2) + '\n');
        }
      }
    }
  }

  let sessionAverageScores = [];
  let totalSessionAverageScores = 0;

  for (let i = 0; i < allDayParticipantsSessions.length; i++) {
    totalSessionAverageScores += (allDayParticipantsSessions[i]['score'] / allDayParticipantsSessions[i]['sessions']);
    sessionAverageScores.push(allDayParticipantsSessions[i]['score'] / allDayParticipantsSessions[i]['sessions']);
  }

  console.log('Score per session Average: ' + (totalSessionAverageScores / allDayParticipantsSessions.length).toFixed(2) + '  (minimum sessions: ' + options[2] + ' / total ids: ' + sessionAverageScores.length + ')\n');

  sessionAverageScores.sort(function (a, b) {
    return b - a;
  });

  for (let i = 0; i < options[1]; i++) {
    console.log('# ' + (i + 1) + ' : ' + sessionAverageScores[i].toFixed(2));
  }

}

request({
  url: options[3],
  json: true
}, function (error, response, body) {

  if (!error && response.statusCode === 200) {

    stats(body, options);

  } else {
    console.log('error: ' + error + '\nstatus code: ' + response.statusCode);
  }
});
