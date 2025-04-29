import express from 'express'
import { addPatientDoc, createAppointment, createChatMsg, createChatroom, createComment, createDoctor, createDoctorSchedule, createDoctorTiers, createExercise, createForumPost, createPatient, createPerscription, createPharmacy, 
    createPill, createPreliminary, createRegiment, createReveiw, createSurvey, deleteAppointment, deleteComment, deleteDoctor, deleteForumPost, deletePatient, deletePerscription, deletePill, deleteRegiment, genereateAudit, getAppointmentsDoctor, getAppointmentsPatient, getChatMesseges, getComments_id, getDoctorAuth, getDoctors, 
    getDoctorSchedule, 
    getExercises, getExerciseByClass, getForumPosts, getPatientAuth, getPatients, getPharmacies, getPharmAuth, getPills, getPreliminaries, getPrescription, getRegiment, getReviews, 
    getReviewsTop, getReviewsByID, 
    getReviewsComments,  getSurvey, getTiers, LogAttempt, rmPatientDoc, UpdateDoctorInfo, UpdateDoctorSchedule, UpdatePatientInfo, UpdatePerscriptionInfo, UpdatePillInfo,
    UpdateRegiment,
    getPatientDoc,
    createApptRequest,
    getApptRequest,
    UpdateApptStat,
    UpdateRequest,
    getDocPatients,
    getPrescriptionDoc,
    getAuthSurvey,
    getSurveyLatestDate,
    getAllDoctors,
    getPatientInfo,
    getDoctorInfo,
    getPharmInfo, getDocID,
    getNearestPharms, getTimeslot, 
    rmPatientAppt,
    checkExistingRequests, startAppointment, endAppointment, fetchApptStartStatus, fetchAppointmentMessages, getAppointmentInfo, appendToRegiment, 
    UpdateDoctorFeedback,
    fetchApptEndStatus, getPillsFromPharm, clearPatientRegiment,
    getPaymentsForAppointments, createPayment,
    UpdatePayment} from './PrimeWell_db.js'
import { sendPrescription, consumePrescriptions } from './rabbitmq.js';  // import the RabbitMQ helper




import cors from 'cors'
import multer from 'multer'
import dotenv from 'dotenv'
import http from "http"
import {Server} from "socket.io"
dotenv.config()

//import socket from 'socket.io'
/*
const server = http.createServer(app);
const io = new socket(server);
*/

const app = express()
app.use(express.json())
app.use(cors())

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log("User connected:", socket.id) // Prints Session ID for Client

    // Joining a Appointment
    socket.on("join_appointment", (appt_id) => {
        socket.join(appt_id)
        console.log(`User ${socket.id} joined appointment: ${appt_id}`)
    })

    // Sending Messages 
    socket.on("send_msg", async (data) => {
        console.log("Message Sent: ", data)
        // Save the message to the database
        const saveChat = await createChatMsg(data.appt_id, data.senderID, data.senderName, data.senderType, data.message)
        console.log(saveChat)
        io.to(data.appt_id).emit("receive_msg", data)
    })

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    })
})

await consumePrescriptions("1", (prescription) => {
    console.log('New prescription received:', prescription); // 
    // Here, push to frontend via WebSocket, or store in database, etc.
});

await consumePrescriptions("2", (prescription) => {
    console.log('New prescription received:', prescription); // 
    // Here, push to frontend via WebSocket, or store in database, etc.
});

await consumePrescriptions("5", (prescription) => {
    console.log('New prescription received:', prescription); // 
    // Here, push to frontend via WebSocket, or store in database, etc.
});

await consumePrescriptions("7", (prescription) => {
    console.log('New prescription received:', prescription); // 
    // Here, push to frontend via WebSocket, or store in database, etc.
});


server.listen(3000, () => {
    console.log('Server is running on port 3000')
})

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // Or req.query.apiKey if you prefer query parameters
  
    if (!apiKey) {
      return res.status(401).json({ message: 'API key required' });
    }
  
    // In real applications, validate the API key against a database or environment variable
    if (apiKey !== process.env.API_KEY) {
      return res.status(403).json({ message: 'Invalid API key' });
    }
  
    next(); // Proceed to the next middleware or route handler
};

// app.use(apiKeyMiddleware)

const store = multer.diskStorage({
    destination: (req, file, cb) => { //where to store (folder name ExerciseBankImages)
        cb(null, './ExerciseBankImages') //cb = call back function
    }, 

    filename: (req, file, cb) => { //file name
        console.log(file);
        cb(null, path.extname(file.originalname))

    }
})
const upload = multer({storage: store})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

//GET DATA ----------------------------------------------------------------------------------------------

/*ADDED: Gets for appointments, doctor schedule, perscription, preliminaries, survey, regiments, chat rooms<-messages, 
and their (1st draft of) audit log entries*/

app.get("/patient/:id", async (req, res) => {
    const rows = await getPatients(req.params.id)
    console.log("Patient Fetched: ", rows)
    const event_Details = 'retrieval of patient data'
    const audit = await genereateAudit(req.params.id, 'Patient', 'GET', event_Details) 
    res.send(rows)
})

app.get("/patientInfo/:id", async (req, res) => {
    const rows = await getPatientInfo(req.params.id)
    const event_Details = 'retrieval of patient profile'
    const audit = await genereateAudit(req.params.id, 'Patient', 'Get', event_Details)
    res.send(rows)
})

app.get("/doctorInfo/:id", async (req, res) => {
    const rows = await getDoctorInfo(req.params.id)
    const event_Details = 'retrieval of patient profile'
    const audit = await genereateAudit(req.params.id, 'Doctor', 'Get', event_Details)
    res.send(rows)
})

app.get("/pharmInfo/:id", async (req, res) => {
    const rows = await getPharmInfo(req.params.id)
    const event_Details = 'retrieval of patient profile'
    const audit = await genereateAudit(req.params.id, 'Pharmacist', 'Get', event_Details)
    res.send(rows)
})

// MAKE THIS A POST REQUEST BECAUSE IT IS SENSITIVE - FI
app.get("/patientDoc/:id", async (req, res) => {
    const rows = await getPatientDoc(req.params.id)
    const event_Details = 'retrieval of patient\'s doctor'
    const audit = await genereateAudit(req.params.id, 'Patient', 'GET', event_Details) 
    res.send(rows)
})

app.get("/doctor/listAll", async (req, res) => {
    const rows = await getAllDoctors()
    res.send(rows)
})

app.get("/doctor/:id", async (req, res) => {
    const rows = await getDoctors(req.params.id)
    console.log("Doctor Fetched: ", rows)
    const event_Details = 'retrieval of doctor data'
    const audit = await genereateAudit(req.params.id, 'Doctor', 'GET', event_Details)
    res.send(rows)
})

app.post("/doctorPatients", async (req, res) => {
    const {Doctor_ID} = req.body;
    if (!Doctor_ID) {
        return res.status(400).json({ error: "Doctor_ID required" });
    }
    try {
        const rows = await getDocPatients(Doctor_ID)
        const event_Details = 'retrieval of doctor\'s patients'
        const audit = await genereateAudit(Doctor_ID, 'Doctor', 'GET', event_Details)
        res.send(rows)
    } 
    catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" })
    }
})


app.get("/pharmacies", async (req, res) => {
    const rows = await getPharmacies()
    const event_Details = 'retrieval of pharmacy data'
    const audit = await genereateAudit(0, 'Pharmacist', 'GET', event_Details)
    res.send(rows)
})

app.get("/pillbank", async (req, res) => {
    const rows = await getPills()
    const event_Details = 'retrieval of pill data'
    const audit = await genereateAudit(0, 'Pharmacist', 'GET', event_Details)
    res.send(rows)
})

app.get("/tiers/:id", async (req, res) => { //tiers by doctor - VC
    const rows = await getTiers(req.params.id)
    res.send(rows)
})

app.get("/exercisebank", async (req, res) => {
    const rows = await getExercises()
    res.send(rows)
})

app.post("/exerciseByClass", async (req, res) => {
    try {
        const { Exercise_Class } = req.body
        const rows = await getExerciseByClass(Exercise_Class)
        res.send(rows)
    }
    catch (error) {
        es.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.get("/regiment/:id", async (req, res) => { //based on patient -VC
    const rows = await getRegiment(req.params.id)
    const event_Details = 'retrieval of patient regiment'
    const audit = await genereateAudit(req.params.id, 'Patient', 'GET', event_Details)
    res.send(rows)
})

app.get("/forumPosts", async (req, res) => {
    const rows = await getForumPosts()
    res.send(rows)
})

app.get("/comments/:id", async (req, res) => { //by post - VC
    const rows = await getComments_id(req.params.id)
    res.send(rows)
})

app.get("/reviews", async (req, res) => {
    const rows = await getReviews()
    res.send(rows)
})

app.get("/reviews/:id", async (req, res) => {
    const rows = await getReviewsByID(req.params.id)
    res.send(rows)
})
    
app.get("/appointment/patient/:id", async (req, res) => {
    try {
        const rows = await getAppointmentsPatient(req.params.id)
        const event_Details = 'retrieval of appointment data'
        const audit = await genereateAudit(req.params.id, 'Patient', 'GET', event_Details)
        res.send(rows)
    } catch (err) {
        console.log("Failed Fetching Appointments for Patient: ", err)
    }
})

app.get("/appointment/doctor/:id", async (req, res) => {
    const rows = await getAppointmentsDoctor(req.params.id)
    const event_Details = 'retrieval of appointment data'
    const audit = await genereateAudit(req.params.id, 'Doctor', 'GET', event_Details)
    res.send(rows)
})

app.get("/request/:id", async (req, res) => { // Used for retrieving a given doctor's appointments, using their Doctor_ID
    const rows = await getApptRequest(req.params.id)
    const event_Details = 'retrieval of appointment requests'
    const audit = await genereateAudit(req.params.id, 'Doctor', 'GET', event_Details)
    res.send(rows)
})

app.get("/prescription/:id", async (req, res) => { //based on patient -VC
    const rows = await getPrescription(req.params.id)
    const event_Details = 'retrieval of perscription'
    const audit = await genereateAudit(req.params.id, 'Patient', 'GET', event_Details)
    res.send(rows)
})

app.get("/prescriptionDoc/:id", async (req, res) => { //based on doctor -VC
    const rows = await getPrescriptionDoc(req.params.id)
    const event_Details = 'retrieval of perscription'
    const audit = await genereateAudit(req.params.id, 'Doctor', 'GET', event_Details)
    res.send(rows)
})

// Why are the params weird?
// MAKE THIS A POST REQUEST BECAUSE IT IS SENSITIVE - FI
app.get("/preliminaries/:id", async (req, res) => {
    try {
        const rows = await getPreliminaries(req.params.id)
        console.log(rows)
        res.send(rows)
    }
    catch (err) {
        console.log("Failed Fetching Preliminaries: ", err)
    }
})

// Change this to a post because it is senstitive
app.get("/chatroomMsgs/:id", async (req, res) => { //by chatroom_id - VC
    const rows = await getChatMesseges(req.params.id)
    res.send(rows)
})

app.get("/reviewsTop", apiKeyMiddleware, async (req, res) => {
    const rows = await getReviewsTop()
    res.send(rows)
})

app.get("/reviews/comments/:id", async (req, res) => {
    const rows = await getReviewsComments(req.params.id)
    res.send(rows)
})

// Make post because it is sensitive
app.get("/patientsurvey/:id", async (req, res) => {
    const rows = await getSurvey(req.params.id)
    const event_Details = 'retrieval of Patient data for graph'
    const audit = await genereateAudit(req.params.id, 'Patient', 'GET', event_Details)
    res.send(rows)
})

app.get("/patientsurveyAuth/:id", async (req, res) => {  //returns true (if posting is ok) or false
    const rows = await getAuthSurvey(req.params.id)
    const event_Details = 'check to see if patient can post survey'
    const audit = await genereateAudit(req.params.id, 'Patient', 'GET', event_Details)
    const tday = new Date();
    if (tday.toISOString().substring(0, 10) != rows[0]?.Survey_Date.toISOString().substring(0, 10)) res.send(tday)
        else res.send('false')
    //res.send(rows)
})

app.get("/appointmentInfo/:id", async (req, res) => {  
    try {
    const rows = await getAppointmentInfo(req.params.id)
    res.send(rows)
    }
    catch (err) {
        console.log("Failed Fetching Appointment Info: ", err)
    }
})

app.get("/pharmacyPills/:id", async (req, res) => {  
    try {
    const rows = await getPillsFromPharm(req.params.id)
    res.send(rows)
    }
    catch (err) {
        console.log("Failed Fetching Appointment Info: ", err)
    }
})

app.get("/paymentAppointments/:id", async (req, res) => {
    try {
        const rows = await getPaymentsForAppointments(req.params.id)
        res.send(rows)
    } catch (err) {
        console.log('Failed Fetching Apointment payments: ', err)
    }
})

app.post("/passAuthPatient", async (req, res) => {
    const { email, pw } = req.body;
    if (!email || !pw) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const rows = await getPatientAuth(email, pw);
       if (rows === undefined) { // If the credentials are not authenticated
        const log_status = await LogAttempt(email, false)
        return res.status(401).json({ error: "Invalid credentials" });
       }
       else {
        const log_status = await LogAttempt(email, true)
        res.send(rows);
       }
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

app.post("/passAuthDoctor", async (req, res) => {
    const { email, pw } = req.body;
    if (!email || !pw) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const rows = await getDoctorAuth(email, pw);
        if (rows === undefined) { // If the credentials are not authenticated
            const log_status = await LogAttempt(email, false)
            return res.status(401).json({ error: "Invalid credentials" });
        }
        else {
            const log_status = await LogAttempt(email, true)
            res.send(rows);
        }
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/passAuthPharm", async (req, res) => {
    const { email, pw } = req.body;
    console.log(req.body)
    if (!email || !pw) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const rows = await getPharmAuth(email, pw);
        if (rows === undefined) { // If the credentials are not authenticated
            const log_status = await LogAttempt(email, false)
            return res.status(401).json({ error: "Invalid credentials" });
        }
        else {
            const log_status = await LogAttempt(email, true)
            res.send(rows);
        }
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/fetchApptMessages", async (req, res) => {
    const { Appointment_ID } = req.body;
    if (!Appointment_ID) {
        return res.status(400).json({ error: "Missing Appointment ID" });
    }

    try {
        const rows = await fetchAppointmentMessages(Appointment_ID)
        res.send(rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

//ADD DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with type POST
// - VC

// Ensure that the ZIP code passed in the Zip field of the request body is an INTEGER between 10000 and 99999 TO SATISFY THE DB CONSTRAINT - FI
// Modify the DB such that the check ensures that Zip codes must be between 88011 and 88019 to match the geographical constraints of the system? ^ - FI
// Ensure that the Pharm_ID passed in the Pharm_ID field of the request body is an EXISTING Pharm_ID in the Pharmacies table } via frontend? - FI
// Ensure that Email holds the form of an email address, Phone holds the form of a phone number, and Address holds the form of a Street address } via frontend? - FI 

/* ADDED: appointments, Doctor schedule, perscription, preliminaries, survey, regiments, chat rooms<-messages, authattempts, 
payments, audit logs*/

app.post("/patient", async (req, res) => {
    const { Pharm_ID, First_Name, Last_Name, Email, Phone, PW, Address, Zip, Doctor_ID } = req.body
    const docId = Doctor_ID !== undefined ? Doctor_ID : null; // Inserts null if Doctor_ID is not provided

    if (!Pharm_ID || !First_Name || !Last_Name || !Email || !Phone || !PW || !Address || !Zip) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
    const newPatient = await createPatient(Pharm_ID, First_Name, Last_Name, Email, Phone, PW, Address, Zip, docId)
    const event_Details = 'Created new Patient'
    const audit = await genereateAudit(newPatient['patient_id'], 'Patient', 'POST', event_Details)
    console.log(newPatient)
    res.status(201).send(newPatient)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

// Ensure that Email holds the form of an email address, Phone holds the form of a phone number } via frontend? - FI 
app.post("/doctor", async (req, res) => {
    const { License_Serial, First_Name, Last_Name, Specialty, Email, Phone, PW, Availability } = req.body

    if (!License_Serial || !First_Name || !Last_Name || !Specialty || !Email || !Phone || !PW || Availability === undefined) { // JS checks for falsy values, since Availability can be 0, we check for undefined rather than falsy
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newDoctor = await createDoctor(License_Serial, First_Name, Last_Name, Specialty, Email, Phone, PW, Availability)
        console.log("Doctor Info: ", newDoctor)
        const event_Details = 'Created new Doctor'
        const audit = await genereateAudit(newDoctor['doctor_id'], 'Doctor', 'POST', event_Details)
        const tiers = await createDoctorTiers(newDoctor['doctor_id'])
        console.log(tiers)
        res.status(201).send(newDoctor)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/doctorSchedule", async (req, res) => {
    const {Doctor_ID, Doctor_Schedule} = req.body

    if (!Doctor_ID |!Doctor_Schedule) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newDoctor = await createDoctorSchedule(Doctor_ID, Doctor_Schedule)
        const event_Details = 'Created new Doctor Schedule'
        const audit = await genereateAudit(Doctor_ID, 'Doctor', 'POST', event_Details)
        res.status(201).send(newDoctor)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/getDoctorSchedule", async (req, res) => {
    const {doc_id, day, date} = req.body

    if (!doc_id || !day || !date) {
        return res.status(400).json({ error: "Missing required information" });
    }
    try {
        //console.log(req.body)
        const rows = await getDoctorSchedule(doc_id, day, date)
        const event_Details = 'retrieval of doctor schedule data'
        const audit = await genereateAudit(doc_id, 'Doctor', 'POST', event_Details)
        res.status(200).send(rows)
    } catch (err) {
        res.status(500).json({message: "Failed to Fetch Doctor Schedule by Day"})
    }
})

// Ensure that the ZIP code passed in the Zip field of the request body is an INTEGER between 10000 and 99999 TO SATISFY THE DB CONSTRAINT - FI
// Modify the DB such that the check ensures that Zip codes must be between 88011 and 88019 to match the geographical constraints of the system? ^ - FI
// Ensure that Email holds the form of an email address, Phone holds the form of a phone number, and Address holds the form of a Street address } via frontend? - FI 
app.post("/pharmacies", async (req, res) => {
    const { Company_Name, Address, Zip, Work_Hours, Email, PW } = req.body
    if (!Company_Name || !Address || !Zip || !Work_Hours || !Email || !PW) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newPharm = await createPharmacy(Company_Name, Address, Zip, Work_Hours, Email, PW)
        const event_Details = 'Created new Pharmacy'
        const audit = await genereateAudit(newPharm["pharm_id"], 'Pharmacist', 'POST', event_Details)
        res.status(201).send(newPharm)
    } catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/getPharmByZip", async (req, res) => {
    const {Zip} = req.body
    if (!Zip) {
        return res.status(400).json({message: "Missing Zip!"})
    }

    try {
        const nearestPharms = await getNearestPharms(Zip)
        res.status(200).send(nearestPharms)
    } catch (err) {
        res.status(500).json({ error: err.message || "Internal server error" });
    }
})

// Ensure that Pharm_ID passed into Pharm_ID field is an existing Pharmacy ID in the Pharmacies table } via frontend? - FI
app.post("/pillbank", async (req, res) => {
    const { Cost, Pill_Name, Pharm_ID, Dosage } = req.body
    if (!Cost || !Pill_Name || !Pharm_ID || !Dosage) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newPill = await createPill(Cost, Pill_Name, Pharm_ID, Dosage)
        const event_Details = 'Created new Pill'
        const audit = await genereateAudit(0, 'Pharmacist', 'POST', event_Details)
        res.status(201).send(newPill)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/fetchApptStartStatus", async (req, res) => {
    const {Appointment_ID} = req.body
    if (!Appointment_ID) {
        return res.status(400).json({ error: "Missing Appt ID information" });
    }

    try {
        const fetchStartStatus = await fetchApptStartStatus(Appointment_ID)
        res.status(201).send(fetchStartStatus)
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/fetchApptEndStatus", async (req, res) => {
    const {Appointment_ID} = req.body
    if (!Appointment_ID) {
        return res.status(400).json({ error: "Missing Appt ID information" });
    }

    try {
        const fetchEndStatus = await fetchApptEndStatus(Appointment_ID)
        res.status(201).send(fetchEndStatus)
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})
/*
for this function to work each entry should be labeled as such:
<form method="POST" action="/upload" enctype="multipart/form-data"> <!--post, /upload-->
        <input type="text" name="desc">  ------- req.body (each attribute has it's proper label)
        <input type="file" name="image"> ------- req.file.originalname
        <input type="submit">
</form>
*/
// -VC
app.post("/exercisebank", upload.single('image'), async (req, res) => { //User created exercise from post - VC
    const { Patient_ID, Exercise_Name, Muscle_Group, Exercise_Description, Exercise_Class, Sets, Reps } = req.body
    if (!Patient_ID || !Exercise_Name || !Muscle_Group || !Exercise_Description || !Exercise_Class || !Sets || !Reps) {
        return res.status(400).json({ error: "Missing required information" });
    }
    try {
        const newExercise = await createExercise(Exercise_Name, Muscle_Group, Exercise_Description, Exercise_Class, Sets, Reps)
        const event_Details = 'Created new exercise'
        const audit = await genereateAudit(Patient_ID, 'Patient', 'POST', event_Details)
        res.status(201).send(newExercise)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

// Ensure that the Patient_ID passed into the Patient_ID field is an existing Patient ID in the PatientBase table } via frontend? - FI
app.post("/forumPosts", async (req, res) => {
    const { Patient_ID, Forum_Text, Exercise_Name, Muscle_Group, Exercise_Description, Exercise_Class, Sets, Reps } = req.body
    if (!Patient_ID || !Forum_Text || !Exercise_Name || !Muscle_Group || !Exercise_Description || !Exercise_Class || !Sets || !Reps) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newExercise = await createExercise(Exercise_Name, Muscle_Group, Exercise_Description, Exercise_Class, Sets, Reps)
        const event_Details1 = 'Created new exercise'
        const audit1 = await genereateAudit(Patient_ID, 'Patient', 'POST', event_Details1)

        const newFPost = await createForumPost(Patient_ID, newExercise.insertId, Forum_Text)
        const event_Details = 'Created new post'
        const audit = await genereateAudit(Patient_ID, 'Patient', 'POST', event_Details)
        res.status(201).send(newFPost)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

// Ensure that the Patient_ID passed into the Patient_ID field is an existing Patient ID in the PatientBase table } via frontend? - FI
// Ensure that the Forum_ID passed into the Forum_ID field is an existing Forum ID in the ForumPosts table } via frontend? - FI
app.post("/comments", async (req, res) => {
    const { Patient_ID, Forum_ID, Comment_Text } = req.body
    console.log("Comment Body: ", req.body)
    if (!Patient_ID || !Forum_ID | !Comment_Text) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try{
    const newComment = createComment(Patient_ID, Forum_ID, Comment_Text)  
    const event_Details = 'Created new comment'
    const audit = await genereateAudit(Patient_ID, 'Patient', 'POST', event_Details)
    res.status(201).send(newComment)
    }catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})


app.post("/regiment", async (req, res) => {
    const { Patient_ID, Regiment } = req.body
    if (!Patient_ID || !Regiment) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try{
    const newRegiment = await createRegiment(Patient_ID, Regiment)
    console.log(newRegiment)
    const event_Details = 'Created new Regiment'
    const audit = await genereateAudit(Patient_ID, 'Patient', 'POST', event_Details)
    res.status(201).send(newRegiment)
    }catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/chatrooms", async (req, res) => { //Chatroom maker is determined by front end in req.body -VC
    if(req.body.Chatroom_Name){
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
    const newChatroom = await createChatroom(req.body.Chatroom_Name)
    const event_Details = 'Created new chatroom'
    const audit = await genereateAudit(req.body.UserID, req.body.UserType, 'POST', event_Details)
    res.status(201).send(newChatroom)
    }catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/messages", async (req, res) => { //chat room id, based on sender type and ID - VC
    const {Appointment_ID, SenderID, SenderType, Message} = req.body
    if(!Appointment_ID | !SenderID | !SenderType |  !Message){
        return res.status(400).json({ error: "Missing required information" });
    }

    try{
    const newMsg = await createChatMsg(Appointment_ID, SenderID, SenderType, Message)
    const event_Details = 'Created message to Appointment Room'
    const audit = await genereateAudit(SenderID, SenderType, 'POST', event_Details)
    res.status(201).send(newMsg)
    }catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})


// Ensure that the Patient_ID passed into the Patient_ID field is an existing Patient ID in the PatientBase table } via frontend? - FI
// Ensure that the Doctor_ID passed into the Doctor_ID field is an existing Doctor ID in the DoctorBase table } via frontend? - FI
// Doctor Accepts the Patient's Request
app.post("/appointment", async (req, res) => {
    const {Patient_ID, Doctor_ID, Appt_Date, Appt_Time, Tier} = req.body
    if (!Patient_ID || !Doctor_ID || !Appt_Date || !Appt_Time || !Tier) {
        return res.status(400).json({ error: "Missing required information" });
    }
    
    try {
        const patientsDoctor = await getPatientDoc(Patient_ID)
        // check if the patient has a doctor, if not - assign them the doctor they've requested in this appointment (Doctor_ID above)
        if (patientsDoctor === undefined) {
            const newDoctor = await addPatientDoc(Patient_ID, Doctor_ID) // give them this new doctor
            const event_Details = "Assigned Doctor to Patient"
            const auditDoc = await genereateAudit(Patient_ID, 'Patient', 'PATCH', event_Details)
        }

        const newAppt = await createAppointment(Patient_ID, Doctor_ID, Appt_Date, Appt_Time, Tier)
        const accept = await UpdateRequest(Patient_ID, Doctor_ID, 'Accepted', Appt_Date, Appt_Time)
        const event_Details = 'Created new Appointment & accepted request'
        const audit = await genereateAudit(Patient_ID, 'Patient', 'POST', event_Details)
        res.status(201).send(newAppt)
    } catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})


app.post("/request", async (req, res) => { // We might not need this since it's in appointments - VC
    const {Patient_ID, Doctor_ID, Appt_Date, Appt_Time, Tier} = req.body
    if (!Patient_ID || !Doctor_ID) {
        return res.status(400).json({ error: "Missing required information" });
    }

    console.log(req.body)
    try {
        const patientsDoctor = await getPatientDoc(Patient_ID)
        console.log("Patient Info: ", patientsDoctor, "DoctorID: ", Doctor_ID)
        //check if correct doctor
        if (patientsDoctor !== undefined && patientsDoctor?.doctor_id !== Doctor_ID) {
            return res.status(400).json({ error: "Patient already has a different doctor"});
        }

        //check to see if appointment time is taken, so sense in giving them the doctor if so
        const timeTaken =  await getTimeslot(Doctor_ID, Appt_Date, Appt_Time);
        // console.log("Time Slot Booked: ", timeTaken)
        if(timeTaken.length > 0){
            return res.status(400).json({ error: "Timeslot taken"});    
        }

        const requestTaken = await checkExistingRequests(Patient_ID, Doctor_ID, Appt_Date, Appt_Time)
        if (requestTaken.length > 0) {
            return res.status(400).json({error: "Request Taken Already"})
        }
        // Generate an audit for assigning a doctor to this patient
        const newAppt = await createApptRequest(Patient_ID, Doctor_ID, Appt_Date, Appt_Time, Tier)
        const event_Details = 'Created new Request for an appointment'
        const audit = await genereateAudit(Patient_ID, 'Patient', 'POST', event_Details)
        res.status(201).send(newAppt)

    } catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/preliminaries", async (req, res) => {
    const {Patient_ID, Symptoms} = req.body
    if (!Patient_ID | !Symptoms) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newAppt = await createPreliminary(Patient_ID, Symptoms)
        const event_Details = 'Created new Preliminary'
        const audit = await genereateAudit(Patient_ID, 'Patient', 'POST', event_Details)
        res.status(201).send(newAppt)
    } catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

// MAY NOT NEED BELOW BECAUSE ITS DONE IN /sendPrescription
app.post("/prescription", async (req, res) => {
    const {Patient_ID, Doctor_ID, Pill_ID, Quantity} = req.body
    if (!Patient_ID | !Doctor_ID | !Pill_ID | !Quantity) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newPrescription = await createPerscription(Patient_ID, Doctor_ID, Pill_ID, Quantity)
        const event_Details = 'Created new Prescription'
        const audit = await genereateAudit(Doctor_ID, 'Doctor', 'POST', event_Details)
        res.status(201).send(newPrescription)
    } catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

// ENDPOINT USED WITH RABBITMQ, SO DOCTOR CAN CREATE AND SEND PRESCRIPTION TO QUEUE
app.post('/sendPrescription', async (req, res) => {
    const {Patient_ID, Doctor_ID, Pill_ID, Quantity, Pharm_ID} = req.body
    if (!Patient_ID | !Doctor_ID | !Pill_ID | !Quantity) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {      
        // Create new prescription
        const newPrescription = await createPerscription(Patient_ID, Doctor_ID, Pill_ID, Quantity)
        console.log(newPrescription)
        const event_Details = 'Created new Prescription'
        const audit = await genereateAudit(Doctor_ID, 'Doctor', 'POST', event_Details)

        // Then send to the appropriate pharmacy queue
        const prescription = {
            Patient_ID,
            Doctor_ID,
            Pill_ID,
            Quantity
        };
        await sendPrescription(Pharm_ID.toString(), prescription);
        res.status(200).json({ message: `Prescription sent to pharmacy ${Pharm_ID}!` });
    } 
    catch (error) 
    {
        console.error('Error sending prescription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Ensure that Patient_ID and Doctor_ID are existing IDs in the PatientBase and DoctorBase tables, respectively } via frontend? - FI
app.post("/reviews", async (req, res) => {
    const {Patient_ID, Doctor_ID, Review_Text, Rating} = req.body
    if(!Patient_ID | !Doctor_ID | !Review_Text | !Rating){
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
    const newReview = await createReveiw(Patient_ID, Doctor_ID, Review_Text, Rating)
    if (!newReview) {
        return res.status(403).json({message: "Patient isn't assigned that doctor!"})
    }
    const event_Details = 'Created new review'
    const audit = await genereateAudit(Patient_ID, 'Patient', 'POST', event_Details)
    res.status(201).send(newReview)
    }catch (error) { 
        console.log(newReview) 
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/patientsurvey", apiKeyMiddleware, async (req, res) => {
    const {Patient_ID, Weight, Caloric_Intake, Water_Intake, Mood} = req.body
    if (!Patient_ID | !Weight | !Caloric_Intake | !Water_Intake| !Mood) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newSurvey = await createSurvey(Patient_ID, Weight, Caloric_Intake, Water_Intake, Mood)
        const event_Details = 'Created new Survey results'
        const audit = await genereateAudit(Patient_ID, 'Patient', 'POST', event_Details)
        res.status(201).send(newSurvey)
    } catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/patientsurvey/date/", async (req, res) => {
    const {patient_id} = req.body
    const rows = await getSurveyLatestDate(patient_id)
    const today = new Date().toISOString().split('T')[0]
    if (rows[0]?.survey_date.toISOString().split('T')[0] != today) {
        return res.send('false')
    } 
    return res.send('true')
})

app.post("/payment", async (req, res) => {
    const {Patient_ID, Related_ID, Payment_Type, Payment_Status} = req.body
    if (!Patient_ID || !Related_ID || !Payment_Type || !Payment_Status) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
    const newPayment = await createPayment(Patient_ID, Related_ID, Payment_Type, Payment_Status)
    const event_Details = 'Patient has made a payment'
    const audit = await genereateAudit(Patient_ID, 'Patient', 'POST', event_Details)
    res.status(201).send(newPayment)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

//UPDATE DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with tyoe PATCH
//update based on a given id - VC

/*ADDED: regiment, appointments, perscription, audit logs*/


// FIX ALL USAGES OF req.body AND req.params BELOW - FI

// BELOW IS CORRECTED
// ONLY MAKE VISIBLE FROM PATIENT PORTAL VIA FRONTEND OR ADD AUTHENTICATION - FI
app.patch('/patient/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let entry = req.body;

        // Fields that are NOT allowed to be updated
        const restrictedFields = ['PW', 'Patient_ID, Doctor_ID', 'Last_Update', 'Create_Date'];

        // Remove restricted fields from the entry object
        entry = Object.fromEntries(
            Object.entries(entry).filter(([key]) => !restrictedFields.includes(key))
        );

        if (Object.keys(entry).length === 0) {
            return res.status(400).json({ error: "No valid fields to update." });
        }

        const updateResult = await UpdatePatientInfo(id, entry);
        const event_Details = 'Edited Patient info';
        const audit = await genereateAudit(id, 'Patient', 'PATCH', event_Details);
        
        console.log(audit);
        res.status(200).json(updateResult);
    } catch (error) { 
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

// ONLY MAKE VISIBLE FROM Patient Portal VIA FRONTEND OR ADD AUTHENTICATION - FI
app.patch('/patient/:id/addDoc', async(req, res)=>{ //Give patient a doctor -VC
    try {
        const {Doctor_ID} = req.body
        const Patient_ID = req.params.id
        const updateResult = await addPatientDoc(Patient_ID, Doctor_ID)
        const event_Details = 'Added Doctor to Patient info'
        const audit = await genereateAudit(Patient_ID, 'Patient', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).json({ error: error.message || "Internal server error" }) }
})

// ONLY MAKE VISIBLE FROM PATIENT PORTAL VIA FRONTEND OR ADD AUTHENTICATION - FI
app.patch('/patientDropDoctor/removeDoc', async(req, res)=>{ //Remove patient doctor -VC
    try {
        const {Patient_ID, Doctor_ID} = req.body
        const updateResult = await rmPatientDoc(Patient_ID)
        const event_Details = 'removed Doctor to Patient info'
        const audit = await genereateAudit(Patient_ID, 'Patient', 'PATCH', event_Details)

        const removeAppts = await rmPatientAppt(Patient_ID, Doctor_ID)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).json({ error: error.message || "Internal server error" }) }
})

// ONLY MAKE VISIBLE FROM DOCTOR PORTAL VIA FRONTEND OR ADD AUTHENTICATION- FI
app.patch('/doctor/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let entry = req.body;

        // Fields that are NOT allowed to be updated
        const restrictedFields = ['PW', 'Doctor_ID', 'License_Serial', 'Specialty', 'Last_Update', 'Create_Date'];

        // Remove restricted fields from the entry object
        entry = Object.fromEntries(
            Object.entries(entry).filter(([key]) => !restrictedFields.includes(key))
        );

        if (Object.keys(entry).length === 0) {
            return res.status(400).json({ error: "No valid fields to update." });
        }

        const updateResult = await UpdateDoctorInfo(id, entry);
        const event_Details = 'Edited Doctor info';
        const audit = await genereateAudit(id, 'Doctor', 'PATCH', event_Details);
        
        console.log(audit);
        res.status(200).json(updateResult);
    } catch (error) { 
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

// MAKE ONLY AVAILABLE TO A DOCTOR FROM THEIR OWN PORTAL VIA FRONTEND OR ADD AUTHENTICATION - FI
app.patch('/doctorSchedule/:id', async(req, res)=>{
    try {
        const { Doctor_Schedule } = req.body
        const Doctor_ID = req.params.id
        const updateResult = await UpdateDoctorSchedule(Doctor_ID, Doctor_Schedule)
        const event_Details = 'Edited Doctor Schedule info'
        const audit = await genereateAudit(Doctor_ID, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).json({ error: error.message || "Internal server error" }) }
})

// MAKE ONLY AVAILABLE TO A DOCTOR FROM THEIR OWN PORTAL VIA FRONTEND OR ADD AUTHENTICATION - FI
app.patch('/prescription/:doctor_id', async(req, res)=>{ //Doctor's can change this - VC
    try {
        const id = req.body.Perscription_ID
        const entry = req.body

        // Fields that are NOT allowed to be updated
        const restrictedFields = ['Perscription_ID', 'Patient_ID', 'Doctor_ID'];

        // Remove restricted fields from the entry object
        entry = Object.fromEntries(
            Object.entries(entry).filter(([key]) => !restrictedFields.includes(key))
        );

        if (Object.keys(entry).length === 0) {
            return res.status(400).json({ error: "No valid fields to update." });
        }

        const updateResult = await UpdatePerscriptionInfo(id, entry)
        const event_Details = 'Edited perscription info'
        const audit = await genereateAudit(req.body.Doctor_ID, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).json({ error: error.message || "Internal server error" }) }
})

// MAKE ONLY AVAILABLE TO SUPER ADMIN FROM THEIR OWN PORTAL VIA FRONTEND OR ADD AUTHENTICATION - FI
app.patch('/pillbank/:pill_id', async(req, res)=>{
    try {
        const Pill_ID = req.params.pill_id
        const entry = req.body
        
        // Fields that are NOT allowed to be updated
        const restrictedFields = ['Pill_ID', 'Last_Update', 'Create_Date']; // Allows Super Admin to change Pill Name, Cost, Pharmacy, Dosage
        
        // Remove restricted fields from the entry object
        entry = Object.fromEntries(
            Object.entries(entry).filter(([key]) => !restrictedFields.includes(key))
        );

        if (Object.keys(entry).length === 0) {
            return res.status(400).json({ error: "No valid fields to update." });
        }

        const updateResult = await UpdatePillInfo(Pill_ID, entry)
        const event_Details = 'Edited Pill info'
        const audit = await genereateAudit(0, 'Pharmacist', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).json({ error: error.message || "Internal server error" }) }
})

app.patch('/regiments/:id', async (req, res) => {
    try {
      const Patient_ID = req.params.id;
      const newRegimentData = req.body.Regiment;
  
      const updateResult = await appendToRegiment(Patient_ID, newRegimentData);
      const event_Details = 'Edited Regiment';
      await genereateAudit(Patient_ID, 'Patient', 'PATCH', event_Details);
  
      res.status(200).send(updateResult);
    } catch (error) {
      console.error("PATCH error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
});
  
app.patch('/regimentClear/:id', async (req, res) => {
    try {
        const Patient_ID = req.params.id

        const clearRegiment = await clearPatientRegiment(Patient_ID)

        res.status(200).send(clearRegiment)
    } catch (err) {
        console.error("PATCH error:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.patch('/rejectRequest', async(req, res) => {
    const {Patient_ID, Doctor_ID, Appt_Date, Appt_Time} = req.body
    if (!Patient_ID || !Doctor_ID || !Appt_Date || !Appt_Time) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const updateResult = await UpdateRequest(Patient_ID, Doctor_ID, 'Rejected', Appt_Date, Appt_Time)
        const event_Details = 'Rejected appointment request'
        const audit = await genereateAudit(Doctor_ID, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(updateResult)
    } catch (error) { 
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

// MODIFY BELOW ST APPOINTMENT ACTUALLY EXISTS, AND DOCTOR IS THE ACTUAL DOCTOR FOR THE APPT
app.patch('/startAppointment', async(req, res) => {
    const {Appointment_ID, Doctor_ID} = req.body
    if (!Appointment_ID || !Doctor_ID) {
        return res.status(400).json({ error: "Missing Appointment ID and/or Doctor_ID" });
    }    
    
    try {
        const startApptResult = await startAppointment(Appointment_ID)
        const event_Details = 'Started appointment'
        const audit = await genereateAudit(Doctor_ID, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(startApptResult)
    } catch (error) { 
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

// MODIFY BELOW ST APPOINTMENT ACTUALLY EXISTS, AND DOCTOR IS THE ACTUAL DOCTOR FOR THE APPT
app.patch('/endAppointment', async(req, res) => {
    const {Appointment_ID, Doctor_ID} = req.body
    if (!Appointment_ID || !Doctor_ID) {
        return res.status(400).json({ error: "Missing Appointment ID and/or Doctor_ID" });
    }    
    
    try {
        const endApptResult = await endAppointment(Appointment_ID)
        const event_Details = 'Ended appointment'
        const audit = await genereateAudit(Doctor_ID, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(endApptResult)
    } catch (error) { 
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.patch('/giveFeedback', async (req, res) => {
    const {appointment_id, doctor_feedback, doctor_id} = req.body
    if (!doctor_feedback || !appointment_id) {
        return res.status(400).json({ error: "Missing Appointment ID and/or Doctor_Feedback"});
    }

    try {
        const addFeedback = await UpdateDoctorFeedback(appointment_id, doctor_feedback)
        const event_Details = 'Ended appointment'
        const audit = await genereateAudit(doctor_id, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(addFeedback)
    } catch (err) {
        res.status(500).json({ error: err.message || "Internal server error" });

    }
})

app.patch("/makePaymentAppointment", async (req, res) => {
    const {Payment_ID, Card_Number} = req.body
    if (!Payment_ID || !Card_Number) {
        return res.status(400).json({ error: "Missing Payment ID and/or Card_Number"});
    }

    try {
        const makePayment = await UpdatePayment(Payment_ID, Card_Number)
        res.status(201).send(makePayment)
    } catch (err) {
        res.status(500).json({ error: err.message || "Internal server error" });
    }
})

//REMOVE DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with type DELETE
// delete based on a given id - VC

/*ADDED: appointments, Doctorschedules, perscription, regiments, posts<-comments, audit logs*/

app.delete("/patient", async(req, res) => {
    const { Patient_ID } = req.body
    const deleteResult = await deletePatient(Patient_ID)
    const event_Details = 'Patient has been deleted'
    const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})// delete any ties to first patient (regiments and appointments)

app.delete("/appointment/patient", async(req, res) => { //Patient cancels appointment (appt_ID) - VC
    const deleteResult = await deleteAppointment(req.body.Appointment_ID)
    const event_Details = 'An appointment has been deleted'
    const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/appointment/doctor", async(req, res) => { //Doctor cancels appointment (appt_ID) - VC
    const deleteResult = await deleteAppointment(req.body.Appointment_ID)
    const event_Details = 'An appointment has been deleted'
    const audit = await genereateAudit(req.body.Doctor_ID, 'Doctor', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/regiment", async(req, res) => {
    const deleteResult = await deleteRegiment(req.body.Regiment_ID)
    const event_Details = 'A regiment has been deleted'
    const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/doctor", async(req, res) => {
    const deleteResult = await deleteDoctor(req.body.Doctor_ID)
    const event_Details = 'Doctor has been deleted'
    const audit = await genereateAudit(req.body.Doctor_ID, 'Doctor', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/tiers", async(req, res) => {
    const deleteResult = await deleteDoctor(req.body.Doctor_ID)
    const event_Details = 'Doctor Tiers has been deleted'
    const audit = await genereateAudit(req.body.Doctor_ID, 'Doctor', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/doctorSchedule", async(req, res) => {
    const deleteResult = await deleteDoctor(req.body.Doctor_ID)
    const event_Details = 'Doctor Schedule has been deleted'
    const audit = await genereateAudit(req.body.Doctor_ID, 'Doctor', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/perscription", async(req, res) => { //Doctor should manage perscriptions - VC
    const deleteResult = await deletePerscription(req.body.Patient_ID)
    const event_Details = 'Doctor has been deleted'
    const audit = await genereateAudit(req.body.Doctor_ID, 'Doctor', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/pillbank", async(req, res) => {
    const deleteResult = await deletePill(req.body.Pill_ID)
    const event_Details = 'Pill has been deleted'
    const audit = await genereateAudit(0, 'Pharmacist', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/comments", async(req, res) => {
    const deleteResult = await deleteComment(req.body.Comment_ID)
    const event_Details = 'Comment has been deleted'
    const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/forumPost", async(req, res) => { //delete all comment rows with this id (Fourm_ID) - VC
    const deleteResult = await deleteForumPost(req.body.Forum_ID)
    const event_Details = 'Post and its comments have been deleted'
    const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})
