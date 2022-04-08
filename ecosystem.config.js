module.exports = {
    apps : [{
      name   : "limit worker",
      script : "./server.js",
      args   : "limit",
      watch  : '.'
    }]
  }