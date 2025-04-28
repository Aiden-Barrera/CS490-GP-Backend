import request from 'supertest'
import app from './server2.js'

/*describe("", ()=>{

})*/

describe("/reviewsTop", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/reviewsTop").set("x-api-key", process.env.API_KEY).send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })
})


describe("/patientInfo/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/patientInfo/2").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual([{"Patient_ID": 2,"Pharm_ID": 2, "First_Name": "Crystal", "Last_Name": "Nunnery", "Email": "cnunnery1@so-net.ne.jp",
            "Phone": "468-327-9664", "PW": "5a5fa13e2caabe784968883d2eb2b00d50f87aaa10b172261ea9e7ff56de8b1b", "Address": "9 Loeprich Pass",
            "Zip": 88017, "Doctor_ID": 5, "Last_Update": "2025-03-11T04:00:00.000Z","Create_Date": "2025-03-11T04:00:00.000Z"}])
    })
})

describe("/doctorInfo/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/doctorInfo/2").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual([{"Doctor_ID": 2, "License_Serial": "277-31-716244", "First_Name": "Myrvyn",
            "Last_Name": "Rubroe", "Specialty": "Dietitian", "Email": "mrubroe1@state.gov", "Phone": "154-748-2473",
            "PW": "81d1a8c76f3077c88e0fcf40bd010979ef8a32f1a164492ab27320fe7c871886",
            "Availability": 1, "Last_Update": "2025-04-24T21:45:32.000Z", "Create_Date": "2025-04-24T21:45:32.000Z"}])
    })
})

describe("/pharmInfo/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/pharmInfo/2").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        //expect(response.body).toStrictEqual({})
    })
})

describe("/doctor/listAll", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/doctor/listAll").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        //expect(response.body).toStrictEqual({})
    })
})

describe("/doctorPatients", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).post("/doctorPatients").send({"Doctor_ID": "2"})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        //expect(response.body).toStrictEqual({})
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/doctorPatients").send({})
        expect(response.statusCode).toBe(400)
    })
})

describe("/doctorSchedule", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).post("/doctorSchedule").send({"Doctor_ID": "2", "Doctor_Schedule": {"Friday": ["10:00-11:00", "11:00-12:00"], "Monday": ["9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "2:00-3:00"], "Sunday": [], "Tuesday": ["8:30-9:30", "9:30-10:30", "10:30-11:30", "1:00-2:00", "3:00-4:00"], "Saturday": [], "Thursday": ["9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "4:00-5:00"], "Wednesday": ["9:30-10:30", "10:30-11:30", "11:30-12:30", "2:00-3:00"]}})
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(["9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "2:00-3:00"])
        //expect(response.body).toStrictEqual({})
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/doctorSchedule").send({"Doctor_ID": "2"})
        expect(response.statusCode).toBe(400)
    })
})

describe("/getDoctorSchedule", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).post("/getDoctorSchedule").send({"doc_id":1, "day":"Tuesday", "date":"2025-03-28"})
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual([
            "9:00-10:00",
            "11:00-12:00",
            "1:00-2:00",
            "2:00-3:00",
            "4:00-5:00"
        ])
        //expect(response.body).toStrictEqual({})
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/doctorSchedule").send({"Doctor_ID": "2"})
        expect(response.statusCode).toBe(400)
    })
})

describe("/pharmacies", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).post("/pharmacies").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual([
            "9:00-10:00",
            "11:00-12:00",
            "1:00-2:00",
            "2:00-3:00",
            "4:00-5:00"
        ])
        //expect(response.body).toStrictEqual({})
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/doctorSchedule").send({"Doctor_ID": "2"})
        expect(response.statusCode).toBe(400)
    })
})

//expect(response.statusCode).toBe(400)
//expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
//expect(response.body.userID).toBeDefined()

/*
list of points to test:

GET DATA
/patientInfo/:id X
/doctorInfo X
/pharmInfo X
/doctor/listAll X
/doctorPatients X
/doctorSchedule X
/pharmacies
/pillbank
/exerciseByClass
/regiment
/forumPosts
/comments
/reviews
/reviews/:id
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
