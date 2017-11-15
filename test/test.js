/**
 * Created by cms on 15.11.2017.
 */
describe("login using local-signup",function () {

    this.timeout(40000);
    //
    //
    // beforeEach(function () {
    //     server = require('../../../server').server;
    //
    //     // browser = new Browser({ site: 'http://localhost:3000' });
    //
    //
    //
    // });


    it("should login with login form",function (done) {
        // browser = new Browser({ site: 'http://localhost:8080' });
        browser.visit('/user/login',function (err,brw) {

            if(err){
                throw err;
            }

            brw.fill('email','test@test.com').fill('password', '1234')
                .pressButton('login', function (err,brow) {
                    brw.assert.success();
                    done();
                });

        });



    });


    // afterEach(function () {
    //     server.close();
    // });

});