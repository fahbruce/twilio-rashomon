module.exports = {
    apps : [{
      name   : "limit worker",
      script : "./server.js",
      args   : "limit",
    }],

    deploy : {
        production : {
            "user" : "rashomd",
            "host" : "ssh.cluster031.hosting.ovh.net",
            "ref"  : 'origin/main',
            "repo" : "https://github.com/fahbruce/twilio-rashomon.git",
            "path" : "/homez.1709/rashomd/smstwilio",
            'pre-deploy-local': '',
            'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --eny production',
            //'pre-setup': ''
        }
    }
  };