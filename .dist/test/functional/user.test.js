"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _user = _interopRequireDefault(require("../../models/user"));

var _app = _interopRequireDefault(require("../../app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const supertest = require("supertest"); // supertest is a framework that allows to easily test web apis


const request = supertest(_app.default);
const userData = {
  email: "test-func@crush.me",
  password: "testtesttest",
  firstName: "firstName",
  lastName: "lastName"
};
var savedUser = null;
describe("testing-user-routes", () => {
  it("GET /user get all users", async done => {
    const users = await request.get("/user");
    expect(users.body).toBeDefined();
    expect(users.status).toBe(200);
    done();
  });
  it("POST /user create an user", async done => {
    const response = await request.post("/user").send(userData);
    savedUser = response.body ? response.body.userSaved : null;
    expect(response.text).toBeDefined();
    expect(response.status).toBe(201);
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.firstName).toBe(userData.firstName);
    expect(savedUser.lastName).toBe(userData.lastName);
    done();
  });
  it('GET /user/:id get user info', async done => {
    const response = await request.get(`/user/${savedUser._id}`);
    const userFound = response.body ? response.body.user : null;
    expect(userFound._id.toString()).toBe(savedUser._id.toString());
    expect(userFound.email).toBe(savedUser.email);
    expect(userFound.firstName).toBe(savedUser.firstName);
    expect(userFound.lastName).toBe(savedUser.lastName);
    done();
  });
  it("PUT /user/:id update user info", async done => {
    savedUser.firstName = 'newFirstName';
    const response = await request.put(`/user/${savedUser._id}`).send(savedUser);
    const updatedUser = response.body ? response.body.user : null;
    expect(response.status).toBe(200);
    expect(updatedUser._id).toBe(savedUser._id);
    expect(updatedUser.email).toBe(savedUser.email);
    expect(updatedUser.firstName).toBe(savedUser.firstName);
    /* the info updated */

    expect(updatedUser.lastName).toBe(savedUser.lastName);
    done();
  });
});
afterAll(async () => {
  try {
    await _user.default.findOneAndDelete({
      _id: savedUser._id
    });
    await _mongoose.default.disconnect();
  } catch (error) {
    console.error(error);
  }
});