import express from 'express'
import { addPatientDoc, createAppointment, createChatMsg, createChatroom, createComment, createDoctor, createDoctorSchedule, createDoctorTiers, createExercise, createForumPost, createPatient, createPerscription, createPharmacy, 
    createPill, createPreliminary, createRegiment, createReveiw, createSurvey, deleteAppointment, deleteComment, deleteDoctor, deleteForumPost, deletePatient, deletePerscription, deletePill, deleteRegiment, genereateAudit, getAppointmentsDoctor, getAppointmentsPatient, getChatMesseges, getComments_id, getDoctorAuth, getDoctors, 
    getDoctorSchedule, 
    getExercises, getForumPosts, getPatientAuth, getPatients, getPharmacies, getPharmAuth, getPills, getPreliminaries, getPrescription, getRegiment, getReviews, 
    getReviewsTop, getSurvey, getTiers, LogAttempt, rmPatientDoc, UpdateApptInfo, UpdateDoctorInfo, UpdateDoctorSchedule, UpdatePatientInfo, UpdatePerscriptionInfo, UpdatePillInfo,
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
        if(rows)
            attempt = await LogAttempt(email, 'Patient', 1);
        else
        attempt = await LogAttempt(email, 'Patient', 0);
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
        if(rows)
            attempt = await LogAttempt(email, 'Doctor', 1);
        else
        attempt = await LogAttempt(email, 'Doctor', 0);
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
        if(rows)
            attempt = await LogAttempt(email, 'Pharmacist', 1);
        else
        attempt = await LogAttempt(email, 'Pharmacist', 0);
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

app.post("/tiers", async (req, res) => {
    const {Doctor_ID, Cost} = req.body

    if (!Doctor_ID |!Cost) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newDoctor = await createDoctorTiers(Doctor_ID, Cost)
        const event_Details = 'Created new Doctor Tiers'
        const audit = await genereateAudit(Doctor_ID, 'Doctor', 'POST', event_Details)
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
    const { Exercise_Name, Muscle_Group, Image, Exercise_Description, Sets, Reps } = req.body
    if (!Exercise_Name || !Muscle_Group || !Exercise_Description || !Sets || !Reps) {
        return res.status(400).json({ error: "Missing required information" });
    }
    try {
        const newExercise = await createExercise(Exercise_Name, Muscle_Group, Image, Exercise_Description, Sets, Reps)
        const event_Details = 'Created new exercise'
        //const audit = await genereateAudit(req.body.id, 'Patient', 'POST', event_Details) //Needs to be fixed
        res.status(201).send(newExercise)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

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

// Ensure that the Patient_ID passed into the Patient_ID field is an existing Patient ID in the PatientBase table } via frontend? - FI
// Ensure that the Forum_ID passed into the Forum_ID field is an existing Forum ID in the ForumPosts table } via frontend? - FI
app.post("/comments", async (req, res) => {
    const { Patient_ID, Forum_ID, Comment_Text } = req.body
    if (!Patient_ID || !Forum_ID | !Comment_Text) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try{
    const newComment = createNewComment(Patient_ID, Forum_ID, Comment_Text)  
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
    const {Chatroom_ID, SenderID, SenderType, Message} = req.body
    if(!Chatroom_ID | !SenderID | !enderType |  !Message){
        return res.status(400).json({ error: "Missing required information" });
    }

    try{
    const newMsg = await createChatMsg(Chatroom_ID, SenderID, SenderType, Message)
    const event_Details = 'Created message to chatrooms'
    const audit = await genereateAudit(SenderID, SenderType, 'POST', event_Details)
    res.status(201).send(newMsg)
    }catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/appointment", async (req, res) => {
    const {Patient_ID, Doctor_ID, Appt_Date, Doctors_Feedback, Tier_ID} = req.body
    if (!Patient_ID | !Doctor_ID | !Appt_Date | !Doctors_Feedback | !Tier_ID) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newAppt = await createAppointment(Patient_ID, Doctor_ID, Appt_Date, Doctors_Feedback, Tier_ID)
        const event_Details = 'Created new Appointment'
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

app.post("/perscription", async (req, res) => {
    const {Patient_ID, Doctor_ID, Pill_ID, Quantity} = req.body
    if (!Patient_ID | !Doctor_ID | !Pill_ID | !Quantity) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newAppt = await createPerscription(Patient_ID, Doctor_ID, Pill_ID, Quantity)
        const event_Details = 'Created new Appointment'
        const audit = await genereateAudit(Doctor_ID, 'Doctor', 'POST', event_Details)
        res.status(201).send(newAppt)
    } catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

// Ensure that Patient_ID and Doctor_ID are existing IDs in the PatientBase and DoctorBase tables, respectively } via frontend? - FI
app.post("/reviews", async (req, res) => {
    const {Patient_ID, Doctor_ID, Review_Text, Rating} = req.body
    if(!Patient_ID | !Doctor_ID | !Review_Text | !Rating){
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
    const newReview = await createReveiw(Patient_ID, Doctor_ID, Review_Text, Rating)
    const event_Details = 'Created new review'
    const audit = await genereateAudit(Patient_ID, 'Patient', 'POST', event_Details)
    res.status(201).send(newReview)
    }catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/survey", async (req, res) => {
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

app.post("/payment", async (req, res) => {
    const {Patient_ID, Card_Number, Related_ID, Payment_Type, Payment_Status} = req.body
    if (!Patient_ID | !Card_Number | !Related_ID | !Payment_Type | !Payment_Status) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
    const newPayment = await createPayment(Patient_ID, Card_Number, Related_ID, Payment_Type, Payment_Status)
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

app.patch('/patient', async(req, res)=>{
    try {
        //We wouldn't techincally change the id since the user has no access to it, but we could use it in req.body
        const entry = req.body
        const updateResult = await UpdatePatientInfo(req.body.Patient_ID, entry)
        const event_Details = 'Edited Patient info'
        const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/patient/addDoc', async(req, res)=>{ //Give patient a doctor -VC
    try {
        const updateResult = await addPatientDoc(req.body.Patient_ID, req.body.Doctor_ID)
        const event_Details = 'Added Doctor to Patient info'
        const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.params.id}) }
})

app.patch('/patient/removeDoc', async(req, res)=>{ //Remove patient doctor -VC
    try {
        const updateResult = await rmPatientDoc(req.body.Patient_ID)
        const event_Details = 'removed Doctor to Patient info'
        const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.params.id}) }
})

app.patch('/doctor', async(req, res)=>{
    try {
        const entry = req.body
        const updateResult = await UpdateDoctorInfo(req.body.Doctor_ID, entry)
        const event_Details = 'Edited Doctor info'
        const audit = await genereateAudit(req.body.Doctor_ID, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/doctorSchedule', async(req, res)=>{
    try {
        const entry = req.body
        const updateResult = await UpdateDoctorSchedule(req.body.Doctor_ID, entry)
        const event_Details = 'Edited Doctor Schedule info'
        const audit = await genereateAudit(req.body.Doctor_ID, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/appointment', async(req, res)=>{ //Doctor's can change this - VC
    try {
        const entry = req.body
        const updateResult = await UpdateApptInfo(req.body.Appointment_ID, entry)
        const event_Details = 'Edited Appointment info'
        const audit = await genereateAudit(req.params.Doctor_ID, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/perscription', async(req, res)=>{ //Doctor's can change this - VC
    try {
        const entry = req.body
        const updateResult = await UpdatePerscriptionInfo(req.body.Perscription_ID, entry)
        const event_Details = 'Edited perscription info'
        const audit = await genereateAudit(req.body.Doctor_ID, 'Doctor', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/pillbank', async(req, res)=>{
    try {
        const entry = req.body
        const updateResult = await UpdatePillInfo(req.body.Pill_ID, entry)
        const event_Details = 'Edited Pill info'
        const audit = await genereateAudit(0, 'Pharmacist', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/regiment', async(req, res)=>{
    try {
        const entry = req.body
        const updateResult = await UpdateRegiment(req.body.Patient_ID, entry)
        const event_Details = 'Edited Regiment'
        const audit = await genereateAudit(req.body.Patient_ID, 'Patient', 'PATCH', event_Details)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

//REMOVE DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with type DELETE
// delete based on a given id - VC

/*ADDED: appointments, Doctorschedules, perscription, regiments, posts<-comments, audit logs*/

app.delete("/patient", async(req, res) => {
    const deleteResult = await deletePatient(req.body.Patient_ID)
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