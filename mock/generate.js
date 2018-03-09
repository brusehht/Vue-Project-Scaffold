module.exports = function () {
  const faker = require("faker");
  const _ = require("lodash");
  // 自定义接口返回值
  const showTables = {
    'output': _.times(50, function (n) {
      return {
        name: faker.random.word(),
        id: faker.random.uuid(),
        time: faker.date.recent(),
        ts: faker.random.word()
      }
    })
  };
  const tableSpecs = {
    'output': {
      'ts': {
        'id': faker.random.uuid(),
        'schema': faker.random.word(),
        'field': _.times(10, function (n) {
          return {
            id: faker.random.uuid(),
            "disp-name": faker.random.word(),
            'type': faker.random.word(),
            'is-key': faker.random.boolean(),
            'limit': faker.random.word()
          }
        })
      }
    }
  };
  const enumOPStatus = ["Up", 'Down'];
  const enumAdminStatus = ['Enable', 'Disable'];
  const controllerList = {
    'output': _.times(10, function () {
      return {
        name: faker.random.uuid(),
        operationStatus: enumOPStatus[Math.floor(Math.random() * enumOPStatus.length)],
        adminStatus: enumAdminStatus[Math.floor(Math.random() * enumAdminStatus.length)],
        ipAddress: faker.internet.ip(),
        port: faker.random.number(),
        Description: faker.random.word(),
      }
    })
  };
  return {
    showTables,
    tableSpecs,
    controllerList
  };
}
