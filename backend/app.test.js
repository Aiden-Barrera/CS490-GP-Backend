import supertest from 'supertest'
import server from './server.js'
//import database from './PrimeWell_db.js'

//install with: npm i -D jest supertes
//NODE_OPTIONS=--experimental-vm-modules npx jest //the line that will rund the tests

/*describe("", ()=>{

})*/

describe("/patient/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(server).post("/patient/2").send({})
    expect()
    })

})


describe("POST /users", ()=>{ //to set tests apart
    describe("given an email and pass", ()=>{
        test("should respond with 200", async () => { //the block that will actually test our code
            const response = await request(server).post("/users").send({
                username: "u",
                password: "pass"
            })
            expect(response.statusCode).toBe(200)
        })

        test("should be type json", async () => {
            const response = await request(server).post("/users").send({
                username: "u",
                password: "pass"
            })
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })

        test("should have userID", async () => {
            const response = await request(server).post("/users").send({
                username: "u",
                password: "pass"
            })
            expect(response.body.userID).toBeDefined()
        })
    })
    
    describe("missing credentials", ()=>{
        test("should respond with 400", async () => {
            const response = await request(server).post("/users").send({
                username: "u",
            })
            expect(response.statusCode).toBe(400)
        })

        test("should respond with 400", async () => {
            const response = await request(server).post("/users").send({
                password: "pass",
            })
            expect(response.statusCode).toBe(400)
        })
    })
})

/*
list of points to test:

GET DATA
/patient/:id
/patientInfo/:id
/doctorInfo
/pharmInfo
/doctor/listAll
/doctor/:id
/doctorPatients
/doctorSchedule
/pharmacies
/pillbank
/exerciseByClass
/regiment
/forumPosts
/comments
/reviews
/reviews/Doctor
/appointment/doctor
/request/:id
/prescription
/preliminaries/:id
/chatroomMsgs
/reviewsTop
/patientsurvey
/appointmentInfo/:id
/passAuthPatient
/passAuthDoctor
/passAuthPharm
/fetchApptMessages

ADD DATA
/patient
/doctor
/doctorSchedule
/getDoctorSchedule
/pharmacies
/getPharmByZip
/pillbank
/fetchApptStartStatus
/fetchApptEndStatus
/exercisebank
*/