let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require("../app");
let jwt = require('jsonwebtoken');
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

            });
    });

    it("should return islogin.", (done) => {
        const token = jwt.sign({
            "userid": 7,
            "usertype": "normaluser",
            "otherid": 5
        }, "goodmorning", { expiresIn: 60 * 60 });
        chai.request(app)
            .post('/login/check')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.isLogin.should.be.eq(true);
                done();
            });
    });

});

// describe("test register, POST /register", () => {
//     it("should register a new account.", (done)=>{
//         chai.request(app)
//             .post('/register')
//             .send({
//                 username: "customer02@gmail.com",
//                 password: "a123456789"
//             })
//             .end((err,res)=>{
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//                 res.body.succeed.should.be.eq(true);
//                 done();
//             });

//     });
// });

describe("test searchbook, GET /books:keyword", () => {
    it("should search book by keywordk.", (done) => {
        chai.request(app)
            .get('/books?keyword=R')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');

                done();
            });

    });

    it("should show the book author and title by id.", (done) => {
        chai.request(app)
            .get('/books/8')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});

describe("test view user appointment, GET /appointment", () => {
    it("should show user appointment", (done) => {
        const token = jwt.sign({
            "userid": 7,
            "usertype": "normaluser",
            "otherid": 5
        }, "goodmorning", { expiresIn: 60 * 60 });
        chai.request(app)
            .get('/userbooking')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');


                done();
            });

    });

    it("should delete an appoinmnet by id", (done) => {
        const token = jwt.sign({
            "userid": 7,
            "usertype": "normaluser",
            "otherid": 5
        }, "goodmorning", { expiresIn: 60 * 60 });

        chai.request(app)
            .delete('/userbooking/21')
            .set('Authorization', `Bearer ${token}`)
            .send({ 'bookid': 6 })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.succeed.should.be.eq(true);

                done();
            });
    });


});


describe("test make appointment", () => {
    it("should make appoint succeed", (done) => {
        const token = jwt.sign({
            "userid": 7,
            "usertype": "normaluser",
            "otherid": 5
        }, "goodmorning", { expiresIn: 60 * 60 });

        chai.request(app)
            .post('/userbooking/make')
            .set('Authorization', `Bearer ${token}`)
            .send({ 'bookid': 6 })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.property('apointid');


                done();
            });

    })

});


describe("test show appointments /appointments", () => {
    it("should show all appoints ", (done) => {
        const token = jwt.sign({
            "userid": 7,
            "usertype": "manager",
            "otherid": 5
        }, "goodmorning", { expiresIn: 60 * 60 });

        chai.request(app)
            .get('/appointments')
            .set('Authorization', `Bearer ${token}`)

            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');



                done();
            });

    });

    it("should confirm an appointment.", (done) => {
        const token = jwt.sign({
            "userid": 7,
            "usertype": "manager",
            "otherid": 5
        }, "goodmorning", { expiresIn: 60 * 60 });

        chai.request(app)
            .put('/appointments/confirm/27')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.succeed.should.be.eq(true);


                done();
            });

    })

});

describe("test book managerment /managebooks", () => {
    it('should upload book.', (done) => {
        const token = jwt.sign({
            "userid": 7,
            "usertype": "manager",
            "otherid": 5
        }, "goodmorning", { expiresIn: 60 * 60 });

        chai.request(app)
            .post('/managebooks/upload')
            .set('Authorization', `Bearer ${token}`)
            .send({ "bookname": "good book", "author": "Mr Denver", "isbn": "3242342423424234" })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.succeed.should.be.eq(true);


                done();
            });
    });

    it('should modify book info.', (done) => {
        const token = jwt.sign({
            "userid": 7,
            "usertype": "manager",
            "otherid": 5
        }, "goodmorning", { expiresIn: 60 * 60 });

        chai.request(app)
            .put('/managebooks/18')
            .set('Authorization', `Bearer ${token}`)
            .send({ "bookname": "good book update", "author": "Mr Denver update", "isbn": "93242342342" })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.succeed.should.be.eq(true);


                done();
            });
    });

    it('should delete book.', (done) => {
        const token = jwt.sign({
            "userid": 7,
            "usertype": "manager",
            "otherid": 5
        }, "goodmorning", { expiresIn: 60 * 60 });

        chai.request(app)
            .delete('/managebooks/16')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.succeed.should.be.eq(true);


                done();
            });
    });
});