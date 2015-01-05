var production = true;

var config = {
  env: production ? 'production' : 'development',
  isDevelop: function () {
    return this.env === 'development';
  }
};

module.exports = config;
