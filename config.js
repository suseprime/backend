var production = process.env.NODE_ENV === 'production' || process.env.OPENSHIFT_NODEJS_VERSION;

var config = {
  env: production ? 'production' : 'development',
  port: production ? 80 : 8080,
  isDevelop: function () {
    return this.env === 'development';
  }
};

module.exports = config;
