import express from 'express'
import { addPatientDoc, createAppointment, createChatMsg, createChatroom, createComment, createDoctor, createDoctorSchedule, createExercise, createForumPost, createPatient, createPerscription, createPharmacy, 
    createPill, createRegiment, createReveiw, createSurvey, deleteAppointment, deleteComment, deleteDoctor, deleteForumPost, deletePatient, deletePerscription, deletePill, deleteRegiment, genereateAudit, getAppointmentsDoctor, getAppointmentsPatient, getChatMesseges, getComments_id, getDoctorAuth, getDoctors, 
    getDoctorSchedule, 
    getExercises, getForumPosts, getPatientAuth, getPatients, getPharmacies, getPharmAuth, getPills, getPreliminaries, getPrescription, getRegiment, getReviews, 
    getReviewsTop, getSurvey, getTiers, rmPatientDoc, UpdateApptInfo, UpdateDoctorInfo, UpdateDoctorSchedule, UpdatePatientInfo, UpdatePerscriptionInfo, UpdatePillInfo,
    UpdateRegiment} from './PrimeWell_db.js'
import cors from 'cors'
import multer from 'multer'

const app = express()
app.use(express.json())
app.use(cors())

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

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
    const event_Details = 'retrieval of patient data'
    const audit = await genereateAudit(req.params.id, 'Patient', 'GET', event_Details) 
    res.send(rows)
})

app.get("/doctor/:id", async (req, res) => {
    const rows = await getDoctors(req.params.id)
    const event_Details = 'retrieval of doctor data'
    const audit = await genereateAudit(req.params.id, 'Doctor', 'GET', event_Details)
    res.send(rows)
})


app.get("/doctorSchedule/:id", async (req, res) => {
    const rows = await getDoctorSchedule(req.params.id)
    const event_Details = 'retrieval of doctor schedule data'
    const audit = await genereateAudit(req.params.id, 'Doctor', 'GET', event_Details)
    res.send(rows)
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

app.get("/appointment/patient/:id", async (req, res) => {
    const rows = await getAppointmentsPatient(req.params.id)
    const event_Details = 'retrieval of appointment data'
    const audit = await genereateAudit(req.params.id, 'Patient', 'GET', event_Details)
    res.send(rows)
})

app.get("/appointment/doctor/:id", async (req, res) => {
    const rows = await getAppointmentsDoctor(req.params.id)
    const event_Details = 'retrieval of appointment data'
    const audit = await genereateAudit(req.params.id, 'Doctor', 'GET', event_Details)
    res.send(rows)
})

app.get("/prescription/:id", async (req, res) => { //based on patient -VC
    const rows = await getPrescription(req.params.id)
    const event_Details = 'retrieval of perscription'
    const audit = await genereateAudit(req.params.id, 'Patient', 'GET', event_Details)
    res.send(rows)
})

app.get("/preliminaries/:id/:doc_id", async (req, res) => { //based on patient, but doctor accesses it -VC
    const rows = await getPreliminaries(req.params.id)
    const event_Details = 'retrieval of Preliminary data'
    const audit = await genereateAudit(req.params.doc_id, 'Doctor', 'GET', event_Details)
    res.send(rows)
})

app.get("/chatroomMsgs/:id", async (req, res) => { //by chatroom_id - VC
    const rows = await getChatMesseges(req.params.id)
    res.send(rows)
})

app.get("/reviews/top", async (req, res) => {
    const rows = await getReviewsTop()
    res.send(rows)
})

app.get("/patientsurvey/:id", async (req, res) => {
    const rows = await getSurvey(req.params.id)
    const event_Details = 'retrieval of Patient data for graph'
    const audit = await genereateAudit(req.params.id, 'Patient', 'GET', event_Details)
    res.send(rows)
})

app.post("/passAuthPatient", async (req, res) => {
    const { email, pw } = req.body;
    if (!email || !pw) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const rows = await getPatientAuth(email, pw);
        res.send(rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/passAuthDoctor", async (req, res) => {
    const { email, pw } = req.body;
    if (!email || !pw) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const rows = await getDoctorAuth(email, pw);
        res.send(rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

app.post("/passAuthPharm", async (req, res) => {
    const { email, pw } = req.body;
    if (!email || !pw) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const rows = await getPharmAuth(email, pw);
        res.send(rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

//ADD DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with type POST
// - VC

// Ensure that the ZIP code passed in the Zip field of the request body is an INTEGER between 10000 and 99999 TO SATISFY THE DB CONSTRAINT - FI
// Modify the DB such that the check ensures that Zip codes must be between 88011 and 88019 to match the geographical constraints of the system? ^ - FI
// Ensure that the Pharm_ID passed in the Pharm_ID field of the request body is an EXISTING Pharm_ID in the Pharmacies table } via frontend? - FI
// Ensure that Email holds the form of an email address, Phone holds the form of a phone number, and Address holds the form of a Street address } via frontend? - FI 

/*TODO: authattempts*/

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
    const audit = await genereateAudit(newPatient["insertId"], 'Patient', 'POST', event_Details)
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
        const event_Details = 'Created new Doctor'
        const audit = await genereateAudit(newDoctor["insertId"], 'Doctor', 'POST', event_Details)
        res.status(201).send(newDoctor)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/doctorSchedule", async (req, res) => {
    const entry = req.body

    if (!req.body.Doctor_ID |!req.body.Doctor_Schedule) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newDoctor = await createDoctorSchedule(entry)
        const event_Details = 'Created new Doctor Schedule'
        const audit = await genereateAudit(req.body.Doctor_ID, 'Doctor', 'POST', event_Details)
        res.status(201).send(newDoctor)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
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
        const audit = await genereateAudit(newPharm["insertId"], 'Pharmacist', 'POST', event_Details)
        res.status(201).send(newPharm)
    } catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/pillbank", async (req, res) => {
    const entry = req.body
    const newPill = await createPill(entry)
    const event_Details = 'Created new Pill'
    const audit = await genereateAudit(0, 'Pharmacist', 'POST', event_Details)
    res.status(201).send(newPill)
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

app.post("/exercisebank/:id", upload.single('image'), async (req, res) => { //User created exercise from post - VC
    const entry = req.body
    const filename = './ExerciseBank/'+req.file.originalname
    const newExercise = await createExercise(entry, filename)
    const event_Details = 'Created new exercise'
    const audit = await genereateAudit(req.params.id, 'Patient', 'POST', event_Details)
    res.status(201).send(newExercise)
})

app.post("/regiment", async (req, res) => {
    const entry = req.body
    const newPill = await createRegiment(entry)
    const event_Details = 'Created new Regiment'
    const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'POST', event_Details)
    res.status(201).send(newPill)
})

app.post("/forumPosts/:id", async (req, res) => { //user has posted -VC
    const entry = req.body
    const newFPost = await createForumPost(entry)
    const event_Details = 'Created new post'
    const audit = await genereateAudit(req.body.id, 'Patient', 'POST', event_Details)
    res.status(201).send(newFPost)
})

/*
// Ensure that the Patient_ID passed into the Patient_ID field is an existing Patient ID in the PatientBase table } via frontend? - FI
app.post("/forumPosts", async (req, res) => {
    const { Patient_ID, Forum_Text } = req.body
    if (!Patient_ID || !Forum_Text) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newFPost = await createForumPost(Patient_ID, Forum_Text)
        const event_Details = 'Created new post'
        const audit = await genereateAudit(Patient_ID, 'Patient', 'POST', event_Details)
        res.status(201).send(newFPost)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})
*/

app.post("/comments/:id", async (req, res) => {
    const entry = req.body
    const newComment = await createComment(entry)
    const event_Details = 'Created new comment'
    const audit = await genereateAudit(req.params.id, 'Patient', 'POST', event_Details)
    res.status(201).send(newComment)
})

app.post("/chatrooms", async (req, res) => { //Who makes the chatroom? -VC
    const entry = req.body
    const newChatroom = await createChatroom(entry)
    //const event_Details = 'Created new post'
    //const audit = await genereateAudit(req.body.SenderID, req.body.SenderType, 'POST', event_Details)
    res.status(201).send(newChatroom)
})

app.post("/messages", async (req, res) => { //chat room id, based on sender type and ID - VC
    const entry = req.body
    const newMsg = await createChatMsg(entry)
    const event_Details = 'Created message to chatrooms'
    const audit = await genereateAudit(req.body.SenderID, req.body.SenderType, 'POST', event_Details)
    res.status(201).send(newMsg)
})

app.post("/appointment", async (req, res) => {
    const entry = req.body
    if (!req.body.Patient_ID | !req.body.Doctor_ID | !req.body.Doctor_ID | !req.body.Date_Scheduled
        | !req.body.Appt_Date | !req.body.Doctors_Feedback | !req.body.Tier_ID) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newAppt = await createAppointment(entry)
        const event_Details = 'Created new Appointment'
        const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'POST', event_Details)
        res.status(201).send(newAppt)
    } catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/preliminaries", async (req, res) => {
    const entry = req.body
    if (!req.body.Patient_ID | !req.body.Symptoms) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newAppt = await createAppointment(entry)
        const event_Details = 'Created new Preliminary'
        const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'POST', event_Details)
        res.status(201).send(newAppt)
    } catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/perscription", async (req, res) => {
    const entry = req.body
    if (!req.body.Patient_ID | !req.body.Doctor_ID | !req.body.Pill_ID | !req.body.Quantity 
        | req.body.Doctor_ID) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newAppt = await createPerscription(entry)
        const event_Details = 'Created new Appointment'
        const audit = await genereateAudit(req.body.Doctor_ID, 'Doctor', 'POST', event_Details)
        res.status(201).send(newAppt)
    } catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/reviews/:id", async (req, res) => {
    const entry = req.body
    const newReview = await createReveiw(entry)
    const event_Details = 'Created new review'
    const audit = await genereateAudit(req.params.id, 'Patient', 'POST', event_Details)
    res.status(201).send(newReview)
})

app.post("/survey", async (req, res) => {
    const entry = req.body
    if (!req.body.Patient_ID | !req.body.Weight | !req.body.Caloric_Intake | !req.body.Water_Intake
        | !req.body.Mood) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newAppt = await createSurvey(entry)
        const event_Details = 'Created new Survey results'
        const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'POST', event_Details)
        res.status(201).send(newAppt)
    } catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/payment", async (req, res) => {
    const entry = req.body
    if (!req.body.Patient_ID | !req.body.Card_Number | !req.body.Related_ID | !req.body.Payment_Type | !req.body.Payment_Status) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
    const newPayment = await createPayment(entry)
    const event_Details = 'Patient has made a payment'
    const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'POST', event_Details)
    res.status(201).send(newPayment)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

//UPDATE DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with tyoe PATCH
//update based on a given id - VC

/*ADDED: regiment, appointments, perscription, audit logs*/

app.patch('/patient/:id', async(req, res)=>{
    try {
        const entry = req.body
        const updateResult = await UpdatePatientInfo(req.params.id, entry)
        const event_Details = 'Edited Patient info'
        const audit = await genereateAudit(req.params.id, 'Patient', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/patient/addDoc/:id/:doc_id', async(req, res)=>{ //Give patient a doctor -VC
    try {
        const updateResult = await addPatientDoc(req.params.id, req.params.doc_id)
        const event_Details = 'Added Doctor to Patient info'
        const audit = await genereateAudit(req.params.id, 'Patient', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.params.id}) }
})

app.patch('/patient/removeDoc/:id', async(req, res)=>{ //Remove patient doctor -VC
    try {
        const updateResult = await rmPatientDoc(req.params.id)
        const event_Details = 'removed Doctor to Patient info'
        const audit = await genereateAudit(req.params.id, 'Patient', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.params.id}) }
})

app.patch('/doctor/:id', async(req, res)=>{
    try {
        const entry = req.body
        const updateResult = await UpdateDoctorInfo(req.params.id, entry)
        const event_Details = 'Edited Doctor info'
        const audit = await genereateAudit(req.params.id, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/doctorSchedule/:id', async(req, res)=>{
    try {
        const entry = req.body
        const updateResult = await UpdateDoctorSchedule(req.params.id, entry)
        const event_Details = 'Edited Doctor Schedule info'
        const audit = await genereateAudit(req.params.id, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/appointment/:id/:d_id', async(req, res)=>{ //Doctor's can change this - VC
    try {
        const entry = req.body
        const updateResult = await UpdateApptInfo(req.params.id, entry)
        const event_Details = 'Edited Appointment info'
        const audit = await genereateAudit(req.params.d_id, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/perscription/:id/:d_id', async(req, res)=>{ //Doctor's can change this - VC
    try {
        const entry = req.body
        const updateResult = await UpdatePerscriptionInfo(req.params.id, entry)
        const event_Details = 'Edited perscription info'
        const audit = await genereateAudit(req.params.d_id, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/pillbank/:id', async(req, res)=>{
    try {
        const entry = req.body
        const updateResult = await UpdatePillInfo(req.params.id, entry)
        const event_Details = 'Edited Pill info'
        const audit = await genereateAudit(0, 'Pharmacist', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/regiment/:id', async(req, res)=>{
    try {
        const entry = req.body
        const updateResult = await UpdateRegiment(req.params.id, entry)
        const event_Details = 'Edited Regiment'
        const audit = await genereateAudit(req.params.id, 'Patient', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

//REMOVE DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with type DELETE
// delete based on a given id - VC

/*ADDED: appointments, Doctorschedules, perscription, regiments, posts<-comments, audit logs*/

app.delete("/patient/:id", async(req, res) => {
    const deleteResult = await deletePatient(req.params.id)
    const event_Details = 'Patient has been deleted'
    const audit = await genereateAudit(req.params.id, 'Patient', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})// delete any ties to first patient (regiments and appointments)

app.delete("/appointment/patient/:id/:p_id", async(req, res) => { //Patient cancels appointment (appt_ID) - VC
    const deleteResult = await deleteAppointment(req.params.id)
    const event_Details = 'An appointment has been deleted'
    const audit = await genereateAudit(req.params.p_id, 'Patient', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/appointment/doctor/:id/:d_id", async(req, res) => { //Doctor cancels appointment (appt_ID) - VC
    const deleteResult = await deleteAppointment(req.params.id)
    const event_Details = 'An appointment has been deleted'
    const audit = await genereateAudit(req.params.d_id, 'Doctor', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/regiment/:id", async(req, res) => {
    const deleteResult = await deleteRegiment(req.params.id)
    const event_Details = 'A regiment has been deleted'
    const audit = await genereateAudit(req.params.id, 'Patient', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/doctor/:id", async(req, res) => {
    const deleteResult = await deleteDoctor(req.params.id)
    const event_Details = 'Doctor has been deleted'
    const audit = await genereateAudit(req.params.id, 'Doctor', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/doctorSchedule/:id", async(req, res) => {
    const deleteResult = await deleteDoctor(req.params.id)
    const event_Details = 'Doctor Schedule has been deleted'
    const audit = await genereateAudit(req.params.id, 'Doctor', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/perscription/:id/:d_id", async(req, res) => { //Doctor should manage perscriptions - VC
    const deleteResult = await deletePerscription(req.params.id)
    const event_Details = 'Doctor has been deleted'
    const audit = await genereateAudit(req.params.d_id, 'Doctor', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/pillbank/:id", async(req, res) => {
    const deleteResult = await deletePill(req.params.id)
    const event_Details = 'Pill has been deleted'
    const audit = await genereateAudit(0, 'Pharmacist', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/comments/:id/:p_id", async(req, res) => {
    const deleteResult = await deleteComment(req.params.id)
    const event_Details = 'Comment has been deleted'
    const audit = await genereateAudit(req.body.p_id, 'Patient', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})

app.delete("/forumPost/:id/:p_id", async(req, res) => { //delete all comment rows with this id (Fourm_ID) - VC
    const deleteResult = await deleteForumPost(req.params.id)
    const event_Details = 'Post and its comments have been deleted'
    const audit = await genereateAudit(req.body.p_id, 'Patient', 'DELETE', event_Details)
    res.status(204).send(deleteResult)
})