var production = process.env.NODE_ENV === 'production';

var config = {
  env: production ? 'production' : 'development',
  port: production ? 80 : 8080,
  isDevelop: function () {
    return this.env === 'development';
  }
};

module.exports = config;
