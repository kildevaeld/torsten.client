
const utils = require('../lib/utils');

describe('',() => {

    it('should', () => {
        let str = utils.slugify("/images/tæst.png");
        str.should.equal('/images/taest.png', str)
    });

});