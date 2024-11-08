import  {expect} from "chai"
import { initializeTestDb, insertTestUser, getToken} from "./helper/test.js"
// require('dotenv').config();
const base_url = "http://localhost:3001/"

// before(async () => {
//     initializeTestDb(); // Ensure this is awaited
// });
before(async () => {
    // Initialize the test database and insert a test user
     initializeTestDb();});

describe("GET tasks",() => {        
    it ("should get all tasks", async() =>{
        const response = await fetch(base_url)
        const data = await response.json()        
        expect(response.status).to.equal(200)
        expect(data).to.be.an("array").that.is.not.empty
        expect(data[0]).to.include.all.keys("id","description")
    })

})

describe("POST register", () => {
    const email = "register@foo.com"
    const password = "register123"
    
    // console.log('register Using database:', process.env.DB_NAME || process.env.TEST_DB_NAME);
    it ("should register with valid email and password", async() => {
        const response = await fetch(base_url + "user/register", {
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({"email":email, "password": password})
        })
        const data = await response.json()
        expect (response.status).to.equal(201,data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("id","email")

    })
    it ("should not post a user with less than 8 character password", async() => {
            const email = "register@foo.com"
            const password = "short1"
            const response = await fetch(base_url + "user/register", {
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({"email":email, "password": password})
        })
        const data = await response.json()
        expect (response.status).to.equal(400, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("error")

    })
})


describe("POST login", () => {
    const email = "register@foo.com";
    const password = "register123";
    insertTestUser(email , password);
    
    // beforeEach(async () => {
    //     await initializeTestDb(); // Reset database
    //     await insertTestUser(email, password); // Ensure test user exists
    // });
    // before(async () => {
    //     initializeTestDb(); // Ensure this is awaited
    // });
    it ("should login with valid credentials",  async() => {
        const response = await fetch(base_url + "user/login", {
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({"email":email, "password": password})
        })
        const data = await response.json()
        // console.log(data)
        expect (response.status).to.equal(200,data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("id","email", "token")

    })
})


describe("POST Tasks",() => {
    const email  = "post@foo.com"
    const password = "post123"
    insertTestUser(email, password)    
    // console.log("Using database:", process.env.NODE_ENV, process.env.DB_NAME, process.env.TEST_DB_NAME);
    // console.log('post Using database:', process.env.DB_NAME || process.env.TEST_DB_NAME);
    const token = getToken(email)
    it ("should post a task", async() =>{
        const response = await fetch(base_url + "create", {
            method:"post",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body:JSON.stringify({"description" : "Task from unit test"})
        })
        const data = await  response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("id")
    })
    it ("should not post a task without description", async () => {
        const response = await fetch(base_url+"create", {
            method:"post",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body:JSON.stringify({"description": null})

        })
        const data = await  response.json()
        expect(response.status).to.equal(400,data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("error")
    
    })

    it ("should not post a task with zero length description ", async () => {
        const response = await fetch(base_url+"create", {
            method:"post",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body:JSON.stringify({"description":""})

        })
        const data = await  response.json()
        expect(response.status).to.equal(400,data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("error")
    
    })
})

describe("DELETE task",() => {
    const email  = "post1@foo.com"
    const password = "post123"
    insertTestUser(email, password)
   
    // console.log('delete Using database:', process.env.DB_NAME || process.env.TEST_DB_NAME);
    const token = getToken(email)
    it ("should delete a task", async() => {
        const response = await fetch(base_url + "delete/1", {
            method:"delete",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            })
            // body:JSON.stringify({"description" : "Task from unit test"})       
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("id") 
    
    })
    it ("should not delete a task with SQL injection", async() => {
        const response = await fetch(base_url + "delete/id=0 or id > 0", {
            method:"delete",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            })
            // body:JSON.stringify({"description" : "Task from unit test"})       
        const data = await response.json()
        expect(response.status).to.equal(400)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("error") })
})

