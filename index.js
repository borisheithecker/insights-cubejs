 const CubejsServer = require('@cubejs-backend/server');
 const dotenv = require('dotenv').config();

const server = new CubejsServer({checkAuthMiddleware: (req, res, next) => {
  return next && next();}});

server.listen().then(({ port }) => { 
  console.log(`🚀 Cube.js server is listening on ${port}`);
});