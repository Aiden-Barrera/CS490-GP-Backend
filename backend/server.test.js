import request from 'supertest'
import app from './server.js'

/*describe("", ()=>{

})*/

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
            "Availability": 1, "Last_Update": "2025-04-17T22:25:07.000Z", "Create_Date": "2025-04-17T22:25:07.000Z"}])
    })
})

describe("/pharmInfo/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/pharmInfo/2").send({})
        expect(response.statusCode).toBe(200)
        expect(response['pharm_id']).toBeDefined()
        //expect(response['compnay_name']).toBeDefined()
        //expect(response['zip']).toBeDefined()
        //expect(response.body).toStrictEqual({})
    })
})

describe("/doctor/listAll", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/doctor/listAll").send({})
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        //expect(response.body).toStrictEqual({})
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