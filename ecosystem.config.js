module.exports = {
    apps : [{
      name   : "limit worker",
      script : "./server.js",
      args   : "limit",
    }],

    deploy : {
        production : {
            "user" : "rashomr",
            "host" : "sshcloud.cluster024.hosting.ovh.net",
            "ref"  : 'origin/main',
            "repo" : "https://github.com/fahbruce/twilio-rashomon.git",
            "path" : "/home/rashomr/smstwilio",
            'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --eny production',
            'pre-setup': ''
        }
    }
  };