module.exports = {
    apps : [{
      name   : "limit worker",
      script : "./server.js",
      args   : "limit",
      watch  : '.'
    }],

    deploy : {
        production : {
            user : 'user ID',
            host : 'host ou ip du server',
            ref  : 'origin/main',
            repo : 'repository git',
            path : 'path server où il ya le projet',
            'pre-deploy-local': '',
            'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --eny production',
            'pre-setup': ''
        }
    }
  };