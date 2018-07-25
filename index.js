
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
let options = ['2018-07-25', 10, 300, url1];

// original id '01a48ec1e1c3668a7f55f401efc53388'
let id = [
  '01a48ec1e1c3668a7f55f401efc53388', // original
  '3d68cef4b216443d83b8ec0f25e5eb71', // 00
  '83e11edfb483c3d83cd9329b7f9e7214', // 01 ...
  ];

function stats(jsonBody, options) {

  let allDayParticipantsSessions = [];
  let mySessions = [];
  let totalDaySessions = 0;

  for (let participant in jsonBody) {
    for (let day in jsonBody[participant]) {
      if (day === options[0] && jsonBody[participant][day]['sessions'] > options[2]) {
        allDayParticipantsSessions.push(jsonBody[participant][day]);
        totalDaySessions += jsonBody[participant][day]['sessions'];
        for (let i = 0; i < id.length; i++) {
          mySessions.push(undefined);
          if (participant === id[i]) {
            mySessions[i] = jsonBody[participant][day];
          }
        }
      }
    }
  }

  console.log('_____________________________________\nDay ' + options[0] + '  /  Arena: ' + options[3].replace('https://hola.org/challenges/haggling/scores/', '') + '\n');

  for (let i = 0; i < mySessions.length; i++) {
    if (mySessions[i]) {
      let idNumber;
      if (i === 0) {
        idNumber = 'original ID'
      } else {
        idNumber = i - 1;
      }
      console.log('> MY SCORE # ' + idNumber + ' :   ' + (mySessions[i].score / mySessions[i].sessions).toFixed(2) + '   Agreed: ' + (mySessions[i].agreements / mySessions[i].sessions).toFixed(2));
    }
    if (i === mySessions.length - 1) {
      console.log('');
    }
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
