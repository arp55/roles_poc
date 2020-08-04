// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

module.exports = function (server) {

  const config = require('config');

  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  router.get('/', (req, res) => {
    res.send("Home page");
  });

  if (!config.get('jwtPrivateKey')) {
    console.log("key is not set buoys");
  }

  server.use(router);
};
