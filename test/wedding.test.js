const request = require("supertest");
const app = require("../app");
const pool = require("../src/configs/db.config.js");
const { data, headers, signIn, event, user, erase } = require("./seeds");

let token = "";

afterAll(async () => {
    await pool.query("DELETE FROM events WHERE user_email = $1", ["mane@gmail.com"]);
    await pool.query("DELETE FROM users WHERE email = $1", ["mane@gmail.com"]);
    pool.end();
});

describe("Test USERS routes", () => {
    test("It should test wrong routes", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(404);
    });

    test("It should get all users", async () => {
        const response = await request(app).get("/api/v1/users");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toEqual("success");
        expect(Array.isArray(response.body.data)).toBeTruthy();
    });

    test("It should create new user", async () => {
        const response = await request(app).post("/api/v1/users/register").send(data);
        token = response.body.token;
        expect(response.status).toBe(201);
        expect(response.body.data.length).toEqual(1);
    });

    test("It should get a single user", async () => {
        const { id } = await user();
        const response = await request(app).get("/api/v1/users/" + id);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(Array.isArray(response.body.data)).toBeTruthy();
    });

    test("It should create new event", async () => {
        try {
            const response = await request(app)
                .post("/api/v1/events")
                .send(event)
                .set("Authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(201);
            expect(response.body.data.length).toBe(1);
        } catch (e) {
            expect(e.message).toMatch("Invalid request data");
        }
    });

    test("It should get specific user's events", async () => {
        try {
            const response = await request(app)
                .get("/api/v1/events")
                .set("Authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.data.length).toBeGreaterThan(0);
        } catch (e) {
            expect(e.message).toMatch("Event does not exist!");
        }
    });

    test("It should update event", async () => {
        const { id } = await erase();
        const response = await request(app)
            .put("/api/v1/events/" + id)
            .send({ name: "jester" })
            .set("Authorization", `Bearer ${token}`);
        expect(response.body.data.length).toEqual(1);
        expect(response.statusCode).toBe(200);
    });

    test("It should delete event", async () => {
        const { id } = await erase();
        const response = await request(app)
            .delete("/api/v1/events/" + id)
            .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Event deleted successfully");
    });

    test("It should update user", async () => {
        const { id } = await user();
        const response = await request(app)
            .put("/api/v1/users/" + id)
            .send({ first_name: "john" })
            .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.data)).toBeTruthy();
    });

    test("It should delete user", async () => {
        const { id } = await user();
        const response = await request(app)
            .delete("/api/v1/users/" + id)
            .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });
});

describe("Test the AUTHENTICATION routes", () => {
    test("It should login user", async () => {
        try {
            const response = await request(app).post("/api/v1/users/login").send(signIn);
            expect(response.body).toHaveProperty("token");
            expect(response.statusCode).toBe(200);
        } catch (e) {
            console.log(e);
            expect(e.message).toMatch("User does not exist");
        }
    });
});
