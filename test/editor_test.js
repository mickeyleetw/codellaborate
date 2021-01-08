require('dotenv');
const { assert, requester } = require('./set_up');


describe('editor validation test',async ()=>{
    it('check editor exist',async ()=>{
        const res1=await requester.get('editor/test11');
        const contentLength1=res1.header["content-length"];
        assert.equal(res1.status,200);
        assert.equal(contentLength1,'4531');

        const res2=await requester.get('./editor/test12');
        const contentLength2=res2.header["content-length"];
        assert.equal(res2.status,400);
        assert.equal(contentLength2,486);
    });
})