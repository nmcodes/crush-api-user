import mongoose from 'mongoose';
const supertest = require("supertest"); // supertest is a framework that allows to easily test web apis
import app from '../../app';

const request = supertest(app);
const userData = { 
	email: "test-func11@crush.com",
	password: "testtesttest",
	firstName: "firstName", 
	lastName: "lastName"
};
var savedUser = null;

describe("testing-user-routes", () => {
  it("GET /user get all users", async done => {
    const users = await request.get("/user");
		expect(users.body).toBeDefined()
		expect(users.status).toBe(200)
		done()
  });
  it("Post /user create an user", async done => {
    const response = await request.post("/user")
																	.send(userData);
		const savedUser = response.body ? response.body.userSaved : null
		expect(response.text).toBeDefined()
		expect(response.status).toBe(201)
		expect(savedUser._id).toBeDefined()
		expect(savedUser.email).toBe(userData.email);
		expect(savedUser.firstName).toBe(userData.firstName);
		expect(savedUser.lastName).toBe(userData.lastName);
		done()
  });
});

afterAll( async () => {
	try {
		// await UserModel.findOneAndDelete({_id: savedUser._id});
		await mongoose.disconnect()
		console.log('\nSuccessully disconnected to MongoDB Atlas !\n')
	} catch (error) {
		console.error(error);
	}
})