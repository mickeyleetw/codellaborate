const {twoSum} = require('../util/dbfunctions');
const {assert}=require('./set_up');

describe('twoSum_unitTest',()=>{
    it('twoSum',()=>{
        assert.deepEqual(twoSum([2, 7, 11, 15], 9),[0, 1]);
        assert.deepEqual(twoSum([2, 7, 11, 15], 22),[1, 3]);
        assert.throw(()=>twoSum([2, 7, 3], 8),Error);
        assert.throw(()=>twoSum([], 2),Error);
        assert.throw(()=>twoSum(1, 2),Error);
        assert.throw(()=>twoSum('1,2,3','sdfjkdslfj'),Error);
        assert.throw(()=>twoSum('1,2,3',1),Error);
        assert.throw(()=>twoSum('1,2,3'),Error);
    });
});
