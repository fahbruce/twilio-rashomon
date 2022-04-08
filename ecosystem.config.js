module.exports = {
    apps : [{
      name   : "limit worker",
      script : "./server.js",
      args   : "limit",
    }],

    deploy : {
        production : {
            "user" : "rashomd",
            "host" : "146.59.209.152",
            "ref"  : 'origin/master',
            "repo" : "https://github.com/fahbruce/twilio-rashomon.git",
            "path" : "/homez.1709/rashomd/smstwilio",
            'pre-deploy-local': '',
            'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --eny production',
            //'pre-setup': ''
        }
    }
  };