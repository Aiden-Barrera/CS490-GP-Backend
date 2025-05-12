import request from 'supertest'
import app from './server.js'

/*describe("", ()=>{

})*/

describe("/reviewsTop", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/reviewsTop").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })
})

//
//==================GET===================
// describe("/patientInfo/:id", ()=>{
//     test("should return rows", async ()=>{
//         const response = await request(app).get("/patientInfo/2").send({})
//         expect(response.statusCode).toBe(200)
//         expect(response.body).toStrictEqual([{"Patient_ID": 2,"Pharm_ID": 2, "First_Name": "Crystal", "Last_Name": "Nunnery", "Email": "cnunnery1@so-net.ne.jp",
//             "Phone": "468-327-9664", "PW": "5a5fa13e2caabe784968883d2eb2b00d50f87aaa10b172261ea9e7ff56de8b1b", "Address": "9 Loeprich Pass",
//             "Zip": 88017, "Doctor_ID": 5, "Last_Update": "2025-03-11T04:00:00.000Z","Create_Date": "2025-03-11T04:00:00.000Z"}])
//     })
// })

/*
describe("/doctorInfo/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/doctorInfo/2").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual([{"Doctor_ID": 2, "License_Serial": "277-31-716244", "First_Name": "Myrvyn",
            "Last_Name": "Rubroe", "Specialty": "Dietitian", "Email": "mrubroe1@state.gov", "Phone": "154-748-2473",
            "PW": "81d1a8c76f3077c88e0fcf40bd010979ef8a32f1a164492ab27320fe7c871886",
            "Availability": 1, "Last_Update": "2025-04-24T21:49:19.000Z", "Create_Date": "2025-04-24T21:49:19.000Z"}])
    })
})
*/
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

describe("/pillbank", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/pillbank").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
    })
})

describe("/exerciseByClass", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).post("/exerciseByClass").send({ "Exercise_Class": "Upper Body" })
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
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

describe("/reviewsTop", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/reviewsTop").send({})
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

describe("/pharmacyPills/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/pharmacyPills/1").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })
})

describe("/paymentAppointments/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/paymentAppointments/1").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })
})

describe("/paymentPrescriptions/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/paymentPrescriptions/1").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
    })
})

describe("/fetchPrescriptions/:id", ()=>{
    test("should return rows", async ()=>{
        const response = await request(app).get("/fetchPrescriptions/1").send({})
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
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

    test("should result in an error", async ()=>{
        const response = await request(app).post("/fetchApptMessages").send({})
        expect(response.statusCode).toBe(400)
        expect(response.body).toBeDefined()
    })
})

//==================ADD===================
/*
describe("/patient", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/patient").send({
            "Pharm_ID":3, 
            "First_Name":"Johnny", 
            "Last_Name":"Hamberta", 
            "Email":"jhambertoski@primewell.com", 
            "Phone":"973-212-2222", 
            "PW":'CD4/09;@', 
            "Address":"32 Bruh street", 
            "Zip":"88012"
        })
        expect(response.statusCode).toBe(201)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/patient").send({})
        expect(response.statusCode).toBe(400)
    })
})

describe("/doctor", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/doctor").send({
            "License_Serial":"960-13-043567", 
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

    test("should result in an error", async ()=>{
        const response = await request(app).post("/doctor").send({})
        expect(response.statusCode).toBe(400)
    })
})

describe("/doctorSchedule", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/doctorSchedule").send({
            "Doctor_ID":"11", 
            "Doctor_Schedule":'{"Friday": ["9:00-10:00", "10:00-11:00", "11:00-12:00"], "Monday": ["8:30-9:30", "9:30-10:30", "10:30-11:30", "1:00-2:00", "3:00-4:00"], "Sunday": [], "Tuesday": ["9:00-10:00", "11:00-12:00", "1:00-2:00", "2:00-3:00", "4:00-5:00"], "Saturday": [], "Thursday": ["10:00-11:00", "11:00-12:00", "1:00-2:00", "2:00-3:00", "4:00-5:00"], "Wednesday": ["9:00-10:00", "10:00-11:00", "12:00-1:00", "1:00-2:00", "3:00-4:00"]}'
        })
        expect(response.statusCode).toBe(201)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/doctorSchedule").send({})
        expect(response.statusCode).toBe(400)
    })
})
*/
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
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/getDoctorSchedule").send({})
        expect(response.statusCode).toBe(400)
    })
})
/*
describe("/pharmacies", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/pharmacies").send({
            "Company_Name": "Jollibee",
            "Address": "86 Cup Rd",
            "Zip": '88210',
            "Work_Hours": '{"Monday": ["09:00-12:00", "14:00-17:00"], "Tuesday": ["10:00-13:00"],"Wednesday": ["08:00-12:00", "13:00-15:00"], "Thursday": ["09:00-11:00"],"Friday": ["10:00-16:00"],"Saturday": [],"Sunday": []}', 
            "Email": "Jollibee@hugedomains.com", 
            "PW":"cA0''YI/%{9%R>z59"
        })
        expect(response.statusCode).toBe(201)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/pharmacies").send({})
        expect(response.statusCode).toBe(400)
    })
})
*/
describe("/getPharmByZip", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/getPharmByZip").send({
            "Zip": '88210'
        })
        expect(response.statusCode).toBe(200)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/getPharmByZip").send({
        })
        expect(response.statusCode).toBe(400)
    })
})

describe("/pillbank", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/pillbank").send({
            "Cost": "349.69",
            "Pill_Name": "Diet Water",
            "Pharm_ID": "1",
            "Dosage": "2",
            "Quantity": "150"
        })
        expect(response.statusCode).toBe(201)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/pillbank").send({
        })
        expect(response.statusCode).toBe(400)
    })
})

describe("/fetchApptStartStatus", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/fetchApptStartStatus").send({
            "Appointment_ID":"3"
        })
        expect(response.statusCode).toBe(201)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/fetchApptStartStatus").send({
        })
        expect(response.statusCode).toBe(400)
    })
})

describe("/fetchApptEndStatus", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/fetchApptEndStatus").send({
            "Appointment_ID":"3"
        })
        expect(response.statusCode).toBe(201)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/fetchApptEndStatus").send({
        })
        expect(response.statusCode).toBe(400)
    })
})

describe("/forumPosts", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/forumPosts").send({
            "Patient_ID": 5, 
            "Forum_Text": "Burpees are my favorite exercise becasue they cover everything", 
            "Exercise_Name": "Burpees", 
            "Muscle_Group": "Full Body", 
            "Exercise_Description": "Burpees are the combination of a jumping jack into a pushup", 
            "Exercise_Class": "Full-Body & HIIT", 
            "Sets": "3", 
            "Reps": "10"
        })
        expect(response.statusCode).toBe(201)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/forumPosts").send({
        })
        expect(response.statusCode).toBe(400)
    })
})

describe("/comments", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/comments").send({
            "Patient_ID":"2", 
            "Forum_ID":"10", 
            "Comment_Text":"It's like Ghandi says, you can drink Diet Coke but why?"
        })
        expect(response.statusCode).toBe(201)
    })

    /*
    test("should result in an error", async ()=>{
        const response = await request(app).post("/comments").send({
        })
        expect(response.statusCode).toBe(400)
    })
    */
})
/*
describe("/regiment", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/regiment").send({
            "Patient_ID":"21", 
            "Regiment":"{\"Sunday\":[], \"Monday\":[\"Bench Press\", \"Rope Pushdown\"], \"Tuesday\":[\"Leg Press\", \"Bicycle crunches\", \"Calf raises\"], \"Wednesday\":[\"Cable Row\", \"Lateral Raises\"], \"Thursday\":[\"Battle ropes\", \"Mountain climbers\"], \"Friday\": [\"Pull-ups\"], \"Saturday\":[]}"
        })
        expect(response.statusCode).toBe(201)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/regiment").send({
        })
        expect(response.statusCode).toBe(400)
    })
})
*/
describe("/appointment", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/appointment").send({
            "Patient_ID":"6", 
            "Doctor_ID":"3", 
            "Appt_Date":"2025-04-28", 
            "Appt_Time":"9:00-10:00", 
            "Tier":"Basic"
        })
        expect(response.statusCode).toBe(201)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/appointment").send({
        })
        expect(response.statusCode).toBe(400)
    })
})

describe("/request", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/request").send({
            "Patient_ID":"1", 
            "Doctor_ID":9, 
            "Appt_Date":"2026-01-27", 
            "Appt_Time":"8:30-9:30", 
            "Tier":"Basic"
        })
        expect(response.statusCode).toBe(400)
    })
})

/*
describe("/preliminaries", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/preliminaries").send({
            "Patient_ID":"21", 
            "Symptoms":'{"Muscle/Joint/Bone":["Back Pain","Leg Pain"],"Eyes/Ears/Nose/Throat":["Loss of Hearing","Nose Bleeds"],"Neurologic":["Memory Loss"],"Cardiovascular":["Chest Pain","Irregular Heart Beat"],"Lungs":["Persistent Cough"],"Skin":["Rash"]}'
        })
        expect(response.statusCode).toBe(201)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/preliminaries").send({
        })
        expect(response.statusCode).toBe(400)
    })
})
*/

// describe("/sendPrescription", ()=>{
//     test("should make entry", async ()=>{
//         const response = await request(app).post("/sendPrescription").send({
//             "Patient_ID":"21", 
//             "Doctor_ID": "3", 
//             "Pill_ID": "1",
//             "Quantity": "2",
//             "Pharm_ID": "3" 
//         })
//         expect(response.statusCode).toBe(200)
//     })

//     test("should result in an error", async ()=>{
//         const response = await request(app).post("/sendPrescription").send({
//         })
//         expect(response.statusCode).toBe(400)
//     })
// })

/*
describe("/reviews", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/reviews").send({
            "Patient_ID":"1",
            "Doctor_ID":"9",
            "Review_Text":"He is a man",
            "Rating":"3"
        })
        expect(response.statusCode).toBe(403)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/reviews").send({
        })
        expect(response.statusCode).toBe(400)
    })
})
/*
/*
describe("/patientsurvey", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/patientsurvey").set("x-api-key", process.env.API_KEY).send({
            "Patient_ID":"12", 
            "Weight":"250", 
            "Caloric_Intake":"2120", 
            "Water_Intake":"150", 
            "Mood":4.2
        })
        expect(response.statusCode).toBe(201)
    })

    test("should get a date", async ()=>{
        const response = await request(app).post("/patientsurvey/date/").set("x-api-key", process.env.API_KEY).send({
            "patient_id":1
        })
        expect(response.statusCode).toBe(200)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/patientsurvey").set("x-api-key", process.env.API_KEY).send({
        })
        expect(response.statusCode).toBe(400)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/patientsurvey/date/").set("x-api-key", process.env.API_KEY).send({
        })
        expect(response.statusCode).toBe(400)
    })
})
*/
describe("/payment", ()=>{
    test("should make entry", async ()=>{
        const response = await request(app).post("/payment").send({
            "Patient_ID":"11",
            "Card_Number":"4111 4561 3331 1221",
            "Related_ID":"13",
            "Payment_Type":"Appointment",
            "Payment_Status":"Paid"
        })
        expect(response.statusCode).toBe(201)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).post("/payment").send({
        })
        expect(response.statusCode).toBe(400)
    })    
})


//==================UPDATE===================

// /patient/:id
describe("/patient/:id", ()=>{
    test("should edit entry", async ()=>{
        const response = await request(app).patch("/patient/1").send({
            "First_Name":"Fardeen",
            "Last_Name":"I"
        })
        expect(response.statusCode).toBe(200)
    })  
})

// /patient/:id/addDoc
describe("/patient/:id/addDoc", ()=>{
    test("should edit entry", async ()=>{
        const response = await request(app).patch("/patient/4/addDoc").send({
            "Doctor_ID":4
        })
        expect(response.statusCode).toBe(201)
    })  
})

// /patientDropDoctor/removeDoc
describe("/patientDropDoctor/removeDoc", ()=>{
    test("should edit entry", async ()=>{
        const response = await request(app).patch("/patientDropDoctor/removeDoc").send({
            "Patient_ID":3
        })
        expect(response.statusCode).toBe(201)
    })  
})

// /doctor/:id
describe("/doctor/:id", ()=>{
    test("should edit entry", async ()=>{
        const response = await request(app).patch("/doctor/3").send({
            "First_Name":"Fardeen"
        })
        expect(response.statusCode).toBe(200)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).patch("/doctor/6").send({
            "PW":"random"
        })
        expect(response.statusCode).toBe(400)
    })   
})

/*
// /doctorSchedule/:id
describe("/doctorSchedule/:id", ()=>{
    test("should edit entry", async ()=>{
        const response = await request(app).patch("/doctorSchedule/2").send(JSON.stringify({
            "Doctor_Schedule":{"Monday":[], "Tuesday":[], "Wednesday":[], "Thursday":[], "Friday":[], "Saturday":[], "Sunday":[]} 
        }))
        expect(response.statusCode).toBe(201)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).patch("/doctorSchedule/").send({
        })
        expect(response.statusCode).toBe(500)
    })   
})

// /prescription/:doctor_id
describe("/prescription/:doctor_id", ()=>{
    test("should edit entry", async ()=>{
        const response = await request(app).patch("/prescription/1").send({
             "Quantity":10
        })
        expect(response.statusCode).toBe(201)
    })

    test("should result in an error", async ()=>{
        const response = await request(app).patch("/prescription/1").send({
            "Pharm_ID":2
        })
        expect(response.statusCode).toBe(400)
    })   
})

// /pillbank/:pill_id
describe("/pillbank/:pill_id", ()=>{
    test("should edit entry", async ()=>{
        const response = await request(app).patch("/pillbank/2").send({
            "Cost":100.00
        })
        expect(response.statusCode).toBe(201)
    })  
})
*/
// /regiments/:id
describe("/regiments/:id", ()=>{
    test("should edit entry", async ()=>{
        const response = await request(app).patch("/regiments/1").send({
            "Regiment":{"Monday":["Lateral Raise"]}
        })
        expect(response.statusCode).toBe(200)
    })  
})

// /regimentClear/:id
describe("/regimentClear/:id", ()=>{
    test("should edit entry", async ()=>{
        const response = await request(app).patch("/regimentClear/1").send({
        })
        expect(response.statusCode).toBe(200)
    })  
})

// /rejectRequest
describe("/rejectRequest", ()=>{
    test("should edit entry", async ()=>{
        const response = await request(app).patch("/regimentClear/1").send({
            "Patient_ID":1, "Doctor_ID":9, "Appt_Date":"2026-01-27", "Appt_Time":"8:30-9:30"
        })
        expect(response.statusCode).toBe(200)
    })  
})

// /startAppointment
describe("/startAppointment", ()=>{
    test("should edit entry", async ()=>{
        const response = await request(app).patch("/startAppointment").send({
            "Appointment_ID":3, "Doctor_ID":4
        })
        expect(response.statusCode).toBe(201)
    })  
})

// /endAppointment
describe("/endAppointment", ()=>{
    test("should edit entry", async ()=>{
        const response = await request(app).patch("/endAppointment").send({
            "Appointment_ID":3, "Doctor_ID":4
        })
        expect(response.statusCode).toBe(201)
    })  
})

// /giveFeedback
describe("/giveFeedback", ()=>{
    test("should edit entry", async ()=>{
        const response = await request(app).patch("/giveFeedback").send({
            "appointment_id":1, "doctor_feedback":"good to see you", "doctor_id":5
        })
        expect(response.statusCode).toBe(201)
    })  
})

//==================DELETE===================
// /appointment/patient
describe("/appointment/patient", ()=>{
    test("should delete entry", async ()=>{
        const response = await request(app).delete("/appointment/patient").send({
            "Appointment_ID":5, "Patient_ID":5
        })
        expect(response.statusCode).toBe(204)
    })  
})

// /appointment/doctor
describe("/appointment/doctor", ()=>{
    test("should delete entry", async ()=>{
        const response = await request(app).delete("/appointment/doctor").send({
            "Appointment_ID":5, "Doctor_ID":5
        })
        expect(response.statusCode).toBe(204)
    })  
})

// /pillbank
describe("/pillbank", ()=>{
    test("should delete entry", async ()=>{
        const response = await request(app).delete("/pillbank").send({
            "Pill_ID":5
        })
        expect(response.statusCode).toBe(204)
    })  
})
