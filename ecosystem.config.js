module.exports = {
    apps : [{
      name   : "limit worker",
      script : "./server.js",
      args   : "limit",
    }],

    deploy : {
        production : {
            "user" : "ubuntu",
            "host" : [
                {
                    "host": "51.77.244.245", 
                    "port": "22"
                }
            ],
            "ref"  : 'origin/main',
            "repo" : "https://github.com/fahbruce/twilio-rashomon.git",
            "path" : "/home/ubuntu/twilio-rashomon",
            "pre-deploy-local" : "",
            'post-deploy' : 'npm-node14 install && pm2 reload ecosystem.config.js --eny production',
            'pre-setup': ""
        }
    }
  };