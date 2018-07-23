
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

  let allDayParticipantsSessions = [];
  let mySessions;
  let totalDaySessions = 0;

  for (let participant in jsonBody) {
    for (let day in jsonBody[participant]) {
      if (day === options[0] && jsonBody[participant][day]['sessions'] > options[2]) {
        allDayParticipantsSessions.push(jsonBody[participant][day]);
        totalDaySessions += jsonBody[participant][day]['sessions'];
        if (participant === id) {
          mySessions = jsonBody[participant][day];
        }
      }
    }
  }

  console.log('_____________________________________\nDay ' + options[0] + '  /  Arena: ' + options[3].replace('https://hola.org/challenges/haggling/scores/', '') + '\n');

  if (mySessions) {
    console.log('> MY SCORE:   ' + (mySessions.score / mySessions.sessions).toFixed(2) + '   Agreed: ' + (mySessions.agreements / mySessions.sessions).toFixed(2) + '\n');
  }

  let totalSessionAverageScores = 0;

  for (let i = 0; i < allDayParticipantsSessions.length; i++) {
    totalSessionAverageScores += (allDayParticipantsSessions[i]['score'] / allDayParticipantsSessions[i]['sessions']);
    allDayParticipantsSessions[i]['scorePerSession'] = (allDayParticipantsSessions[i]['score'] / allDayParticipantsSessions[i]['sessions']);
    allDayParticipantsSessions[i]['agreementsPercentage'] = (allDayParticipantsSessions[i]['agreements'] / allDayParticipantsSessions[i]['sessions']);
  }

  console.log('Score per session Average:  ' + (totalSessionAverageScores / allDayParticipantsSessions.length).toFixed(2) + '  (minimum sessions: ' + options[2] + ' / total ids: ' + allDayParticipantsSessions.length + ' / total sessions: ' + totalDaySessions + ')\n');

  allDayParticipantsSessions.sort(function (a, b) {
    return b.scorePerSession - a.scorePerSession;
  });

  let maxTopParticipants = options[1];
  if (allDayParticipantsSessions.length < options[1]) {
    maxTopParticipants = allDayParticipantsSessions.length;
  }
  for (let i = 0; i < maxTopParticipants; i++) {
    console.log('# ' + (i + 1) + '     ' + allDayParticipantsSessions[i]['scorePerSession'].toFixed(2) + '      Agreed: ' + allDayParticipantsSessions[i]['agreementsPercentage'].toFixed(2) + ' - Sessions: ' + allDayParticipantsSessions[i]['sessions']);
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
