const path = require('path');

module.exports = {
  entry: {
    main_ancient: './src/Cal/output_worker.mjs',
    main_de: './src/Cal/output_de_worker.mjs',
    // main_vsop: './src/Cal/output_vsop_worker.mjs'
  },
  output: {
    filename: '[name].js', // 使用占位符[name]为每个入口生成唯一的文件名
    path: path.resolve(__dirname, 'public'),
  },
  mode: 'production',
};