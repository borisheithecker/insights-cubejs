 const CubejsServer = require('@cubejs-backend/server');
 const dotenv = require('dotenv').config();

 const PostgresDriver = require('@cubejs-backend/postgres-driver');

// const server = new CubejsServer({checkAuthMiddleware: (req, res, next) => {
//   return next && next();}});

const dbType = 'postgres';
const queueOptions = {
  executionTimeout: 6000,
};
const options = {
  dbType,
  devServer: true,
  logger: (msg, params) => {
    console.log(`${msg}: ${JSON.stringify(params)}`);
  },
  schemaPath: 'schema',

  apiSecret: 'asdfasf',
  driverFactory: ({ dataSource }) => new PostgresDriver({executionTimeout: 6000}), //{ database: nbc }

  orchestratorOptions: {
    queryCacheOptions: {
      queueOptions
    },
    preAggregationsOptions: { queueOptions },
  },
};

const server = new CubejsServer(options);

server.listen().then(({ port }) => { 
  console.log(`🚀 Cube.js server is listening on ${port}`);
});