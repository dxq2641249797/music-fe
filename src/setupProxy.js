const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    proxy(
      '/api', {
        target: 'https://60.205.252.42:3000',
        changeOrigin: true,
        ws: true, // proxy websockets
        pathRewrite: {
          // '^/api/old-path': '/api/new-path', // 重写路径
        }
      }
    )
  )
}