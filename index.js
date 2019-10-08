 const CubejsServer = require('@cubejs-backend/server');
 const dotenv = require('dotenv').config();

const server = new CubejsServer();

server.listen().then(({ port }) => { 
  console.log(`🚀 Cube.js server is listening on ${port}`);
});