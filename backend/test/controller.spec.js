let mocha = require('mocha');
let describe = mocha.describe;
const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require('sinon');
const app = require('../app/REST-Controller/controller');
const User = require("../app/models/persistence/User");

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Users", () => {
    describe("GET /", () => {
        const userMock = sinon.mock(User);
        // Test to get all students record
        it("should get all students record", (done) => {
            const userId = 1;
            var expectedUser = {
                userId: "testId1",
                console: "PC"
            };

            userMock.expects('findOne').withArgs(sinon.match.any).returns(expectedUser);

            chai.request(app)
                .get("/user/" + userId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        // // Test to get single student record
        // it("should get a single student record", (done) => {
        //     const id = 1;
        //     chai.request(app)
        //         .get(`/${id}`)
        //         .end((err, res) => {
        //             res.should.have.status(200);
        //             res.body.should.be.a('object');
        //             done();
        //         });
        // });
        //
        // // Test to get single student record
        // it("should not get a single student record", (done) => {
        //     const id = 5;
        //     chai.request(app)
        //         .get(`/${id}`)
        //         .end((err, res) => {
        //             res.should.have.status(404);
        //             done();
        //         });
        // });
    });
});