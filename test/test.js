let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require("../app");
let { expect } = chai;
let should = chai.should();

chai.use(chaiHttp);

describe("test login, POST /login", () => {
    let user = {
        username: "customer01@gmail.com",
        password: "a123456789"
    }
    it("should login succeed using correct pwd username.", (done) => {
        chai.request(app)
            .post('/login')
            .send(user)
            .end((err, res) => {
                
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eq(1);
                done();

            })
    });

    it("should login fail using error pwd username.", (done) => {
        chai.request(app)
            .post('/login')
            .send({
                username: "customer01@gmail.com",
                password: "a1234567sd89"
            })
            .end((err, res) => {
                
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eq(0);
                done();

            })
    });


});