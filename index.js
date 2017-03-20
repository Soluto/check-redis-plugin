#!/usr/bin/env node
'use strict';
const bytes = require('bytes');
const request = require('request');

const getOpt = require('node-getopt')
    .create([
          [ 'w', 'warning=ARG', 'Warning threshold. The default value is 5' ]
        , [ 'c', 'critical=ARG', 'Critical threshold. The default value is 15' ]
        , [ 'o', 'host=ARG', 'Webdis host' ]
        , [ 'u', 'username=ARG', 'Webdis username' ]
        , [ 'p', 'password=ARG', 'Webdis password' ]
        , [ 'h', 'help', 'display this help' ] ])
    .bindHelp()
    .setHelp('Usage: node index.js \nOptions:\n[[OPTIONS]]');

const args = getOpt.parseSystem();

const critical = args.options.critical || "15GB";
const warning = args.options.warning || "5GB";
const host = args.options.host;
const username = args.options.username;
const password = args.options.password;

if (!host || !username || !password){
  console.log('missing required arguments')
  getOpt.showHelp();
  process.exit(3);
}

const url = `http://${host}:7379/info`;
const auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

request(
    {
        url : url,
        headers : {
            "Authorization" : auth
        }
    },
    function (error, response, body) {
        if (error){
          console.log(error);
          process.exit(3);
        }

        var data = JSON.parse(body);
        const usedMemory = parseInt(data.info.used_memory_peak);

        if (usedMemory >= bytes(critical)){
          console.log(`CRITICAL redis memory usage ${bytes(usedMemory)} threshold: ${critical}`)
          process.exit(2)
        }
        else if (usedMemory >= bytes(warning)){
          console.log(`WARNING redis memory usage ${bytes(usedMemory)} threshold: ${warning}`)
          process.exit(1)
        }
        else {
          console.log(`OK redis memory usage ${bytes(usedMemory)}`)
        }
    }
);
