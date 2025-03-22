import express from 'express'
import { addPatientDoc, createComment, createDoctor, createExercise, createForumPost, createPatient, createPharmacy, 
    createPill, createReveiw, deleteDoctor, deletePatient, deletePill, getComments_id, getDoctorAuth, getDoctors, 
    getExercises, getForumPosts, getPatientAuth, getPatients, getPharmacies, getPharmAuth, getPills, getReviews, 
    getReviewsTop, getTiers, rmPatientDoc, UpdateDoctorInfo, UpdatePatientInfo, UpdatePillInfo} from './PrimeWell_db.js'
import cors from 'cors'

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

//GET DATA ----------------------------------------------------------------------------------------------

app.get("/patient", async (req, res) => {
    const rows = await getPatients()
    res.send(rows)
})

app.get("/doctor", async (req, res) => {
    const rows = await getDoctors()
    res.send(rows)
})

app.get("/pharmacies", async (req, res) => {
    const rows = await getPharmacies()
    res.send(rows)
})

app.get("/pillbank", async (req, res) => {
    const rows = await getPills()
    res.send(rows)
})

app.get("/tiers", async (req, res) => {
    const rows = await getTiers()
    res.send(rows)
})

app.get("/exercisebank", async (req, res) => {
    const rows = await getExercises()
    res.send(rows)
})

app.get("/forumPosts", async (req, res) => {
    const rows = await getForumPosts()
    res.send(rows)
})

app.get("/comments/:id", async (req, res) => {
    const rows = await getComments_id(req.params.id)
    res.send(rows)
})

app.get("/reviews", async (req, res) => {
    const rows = await getReviews()
    res.send(rows)
})

app.get("/reviews/top", async (req, res) => {
    const rows = await getReviewsTop()
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
// Add to db via a new id, can also be done with SET @valI = (SELECT COUNT(*) FROM primewell_clinic.table);
// - VC

// Ensure that the ZIP code passed in the Zip field of the request body is an INTEGER between 10000 and 99999 TO SATISFY THE DB CONSTRAINT - FI
// Modify the DB such that the check ensures that Zip codes must be between 88011 and 88019 to match the geographical constraints of the system? ^ - FI
// Ensure that the Pharm_ID passed in the Pharm_ID field of the request body is an EXISTING Pharm_ID in the Pharmacies table } via frontend? - FI
// Ensure that Email holds the form of an email address, Phone holds the form of a phone number, and Address holds the form of a Street address } via frontend? - FI 
app.post("/patient", async (req, res) => {
    const { Pharm_ID, First_Name, Last_Name, Email, Phone, PW, Address, Zip, Doctor_ID } = req.body
    const docId = Doctor_ID !== undefined ? Doctor_ID : null; // Inserts null if Doctor_ID is not provided

    if (!Pharm_ID || !First_Name || !Last_Name || !Email || !Phone || !PW || !Address || !Zip) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
    const newPatient = await createPatient(Pharm_ID, First_Name, Last_Name, Email, Phone, PW, Address, Zip, docId)
    res.status(201).send(newPatient)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

// Ensure that Email holds the form of an email address, Phone holds the form of a phone number, and Address holds the form of a Street address } via frontend? - FI 
app.post("/doctor", async (req, res) => {
    const { License_Serial, First_Name, Last_Name, Specialty, Email, Phone, PW, Availability } = req.body

    if (!License_Serial || !First_Name || !Last_Name || !Specialty || !Email || !Phone || !PW || Availability === undefined) { // JS checks for falsy values, since Availability can be 0, we check for undefined rather than falsy
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newDoctor = await createDoctor(License_Serial, First_Name, Last_Name, Specialty, Email, Phone, PW, Availability)
        res.status(201).send(newDoctor)
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/pharmacies", async (req, res) => {
    const { Company_Name, Address, Zip, Work_Hours, Email, PW } = req.body
    if (!Company_Name || !Address || !Zip || !Work_Hours || !Email || !PW) {
        return res.status(400).json({ error: "Missing required information" });
    }

    try {
        const newPharm = await createPharmacy(Company_Name, Address, Zip, Work_Hours, Email, PW)
        res.status(201).send(newPharm)
    } catch (error) {  
        res.status(500).json({ error: error.message || "Internal server error" });
    }
})

app.post("/pillbank", async (req, res) => {
    const entry = req.body
    const newPill = await createPill(entry)
    res.status(201).send(newPill)
})

app.post("/exercisebank", async (req, res) => {
    const entry = req.body
    const newExercise = await createExercise(entry)
    res.status(201).send(newExercise)
})

app.post("/forumPosts", async (req, res) => {
    const entry = req.body
    const newFPost = await createForumPost(entry)
    res.status(201).send(newFPost)
})

app.post("/comments", async (req, res) => {
    const entry = req.body
    const newComment = await createComment(entry)
    res.status(201).send(newComment)
})

app.post("/comments", async (req, res) => {
    const entry = req.body
    const newComment = await createComment(entry)
    res.status(201).send(newComment)
})

app.post("/reviews", async (req, res) => {
    const entry = req.body
    const newReview = await createReveiw(entry)
    res.status(201).send(newReview)
})

//UPDATE DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with tyoe PATCH
//update based on a given id - VC

app.patch('/patient/:id', async(req, res)=>{
    try {
        const entry = req.body
        const updateResult = await UpdatePatientInfo(req.params.id, entry)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/patient/addDoc/:id/:doc_id', async(req, res)=>{ //Give patient a doctor -VC
    try {
        const updateResult = await addPatientDoc(req.params.id, req.params.doc_id)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.params.id}) }
})

app.patch('/patient/removeDoc/:id', async(req, res)=>{ //Remove patient doctor -VC
    try {
        const updateResult = await rmPatientDoc(req.params.id)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.params.id}) }
})

app.patch('/doctor/:id', async(req, res)=>{
    try {
        const entry = req.body
        const updateResult = await UpdateDoctorInfo(req.params.id, entry)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

app.patch('/pillbank/:id', async(req, res)=>{
    try {
        const entry = req.body
        const updateResult = await UpdatePillInfo(req.params.id, entry)
        res.status(201).send(updateResult)
        }
    catch(error) { res.status(500).send(error).json({"message":req.body}) }
})

//REMOVE DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with tyoe DELETE
// delete based on a given id - VC

app.delete("/patient/:id", async(req, res) => {
    const deleteResult = await deletePatient(req.params.id)
    res.status(204).send(deleteResult)
})

app.delete("/doctor/:id", async(req, res) => {
    const deleteResult = await deleteDoctor(req.params.id)
    res.status(204).send(deleteResult)
})

app.delete("/pillbank/:id", async(req, res) => {
    const deleteResult = await deletePill(req.params.id)
    res.status(204).send(deleteResult)
})