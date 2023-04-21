const path = require('path');

module.exports = {
  entry: './src/Cal/output_frontend-worker.mjs',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public'),
  },
  mode: 'production',
};