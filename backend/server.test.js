import request from 'supertest'
import app from './server.js'

/*describe("", ()=>{

})*/

describe("/reviewsTop", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/reviewsTop").set("x-api-key", process.env.API_KEY).send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })
})


//==================GET===================
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
            "Availability": 1, "Last_Update": "2025-04-24T21:49:19.000Z", "Create_Date": "2025-04-24T21:49:19.000Z"}])
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

describe("/pillbank", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/pillbank").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        //expect(response.body).toStrictEqual({})
    })
})

describe("/pillbank", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/pillbank").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        //expect(response.body).toStrictEqual({})
    })
})

describe("/exerciseByClass", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).post("/exerciseByClass").send({ "Exercise_Class": "Upper Body" })
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        //expect(response.body).toStrictEqual({})
    })
})

describe("/regiment/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/regiment/2").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })
})

describe("/forumPosts", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/forumPosts").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })
})

describe("/comments/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/comments/1").send({})
        expect(response.statusCode).toBe(200)
    })
})

describe("/reviwes", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/reviews").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })

    test("should return rows based on ID", async ()=>{
        const response = await request(app).get("/reviews/1").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })
})

describe("/appointment/doctor/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/appointment/doctor/4").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })
})

describe("/request/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/request/1").send({})
        expect(response.statusCode).toBe(200)
    })
})

describe("/prescription/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/prescription/4").send({})
        expect(response.statusCode).toBe(200)
    })
})

describe("/preliminaries/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/preliminaries/4").send({})
        expect(response.statusCode).toBe(200)
    })
})

/*describe("/chatroomMsgs/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/chatroomMsgs/3").send({})
        expect(response.statusCode).toBe(200)
    })
})*/

describe("/reviewsTop", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/reviewsTop").set("x-api-key", process.env.API_KEY).send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })
})

describe("/patientsurvey/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/patientsurvey/3").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })
})

describe("/appointmentInfo/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/appointmentInfo/2").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })
})

describe("/passAuthPatient", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).post("/passAuthPatient").send({ "email": "cdignum0@ucla.edu", "pw":"cP0\"},1la&q"})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })

    test("should return an error", async ()=>{
        const response = await request(app).post("/passAuthPatient").send({ "email": "cdignum0@ucla.edu"})
        expect(response.statusCode).toBe(400)
    })

    test("should return an error", async ()=>{
        const response = await request(app).post("/passAuthPatient").send({ "pw":"cP0\"},1la&q"})
        expect(response.statusCode).toBe(400)
    })
})

describe("/passAuthDoctor", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).post("/passAuthDoctor").send({ "email": "mrubroe1@state.gov", "pw":"nG5,.0O7"})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })

    test("should return an error", async ()=>{
        const response = await request(app).post("/passAuthDoctor").send({ "email": "mrubroe1@state.gov"})
        expect(response.statusCode).toBe(400)
    })

    test("should return an error", async ()=>{
        const response = await request(app).post("/passAuthDoctor").send({ "pw":"nG5,.0O7"})
        expect(response.statusCode).toBe(400)
    })
})

describe("/passAuthPharm", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).post("/passAuthPharm").send({ "email": "mcoopey2@businesswire.com", "pw":"dG8~`SOx/j=N/`Z"})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })

    test("should return an error", async ()=>{
        const response = await request(app).post("/passAuthPharm").send({ "email": "mcoopey2@businesswire.com"})
        expect(response.statusCode).toBe(400)
    })

    test("should return an error", async ()=>{
        const response = await request(app).post("/passAuthPharm").send({ "pw":"dG8~`SOx/j=N/`Z"})
        expect(response.statusCode).toBe(400)
    })
})

describe("/fetchApptMessages", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).post("/fetchApptMessages").send({"Appointment_ID": 2})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })

    test("should return rows", async ()=>{
        const response = await request(app).post("/fetchApptMessages").send({})
        expect(response.statusCode).toBe(400)
        expect(response.body).toBeDefined()
    })
})

//==================ADD===================
describe("/patient", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/patient").send({
            "Pharm_ID":3, 
            "First_Name":"John", 
            "Last_Name":"Hambert", 
            "Email":"jhambert@primewell.com", 
            "Phone":"973-222-2222", 
            "PW":'CD4/09;@', 
            "Address":"32 Pig street", 
            "Zip":"88012"
        })
        expect(response.statusCode).toBe(201)
    })
})


describe("/doctor", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/doctor").send({
            "License_Serial":"277-31-716244", 
            "First_Name":"John", 
            "Last_Name":"Hambert", 
            "Specialty": "Dietitian",
            "Email":"jhambert@primewell.com", 
            "Phone":"973-222-2222", 
            "PW":'CD4/09;@', 
            "Address":"32 Pig street", 
            "Availability":1
        })
        expect(response.statusCode).toBe(201)
    })
})

/*describe("/doctorSchedule", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/doctor").send({
          
        })
        expect(response.statusCode).toBe(201)
    })
})*/

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
