const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const {NODE_ENV} = process.env;
// const {truncateFakeData, createFakeData} = require('./fake_data_generator');
const {createFakeEditor,truncateFakeData}=require('./fake_data_generator');

chai.use(chaiHttp);

const assert = chai.assert;
const requester = chai.request('http://127.0.0.1:3001/');

before(async () => {
    if (NODE_ENV !== 'test') {
        throw 'Not in test env';
    }
    // this.enableTimeouts(false)
    await truncateFakeData();
    await createFakeEditor();
});

module.exports = {
    assert,
    requester,
};