require('dotenv').config();
const { NODE_ENV } = process.env;
const { editor } = require('./fake_data');
const { sqlquery } = require('../server/model/mysqlcon.js');

async function createFakeEditor() {
    const editorIDs = editor.map(obj => obj.editorID)
    for (let i = 0; i < editorIDs.length; i++) {
        const sqlu = `INSERT INTO editor SET editorID=?;`
        const result = await sqlquery(sqlu, editorIDs[i]);
    }
    console.log('Add Fake data');
}

async function truncateFakeData() {
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }
    // console.log('truncate fake data');
    const sqlu = 'TRUNCATE TABLE editor;'
    await sqlquery(sqlu);
    console.log('truncate fake data');
}

module.exports = { createFakeEditor, truncateFakeData }