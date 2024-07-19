const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
  app.use(
    '/api/here',
    createProxyMiddleware({
      target: 'https://route.ls.hereapi.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/here': '', // Remove /api/here from the path
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${proxyReq.path}`);
      }
    })
  );
};