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

app.post("/patient", async (req, res) => {
    const entry = req.body
    const newPatient = await createPatient(entry)
    res.status(201).send(newPatient)
})

app.post("/doctor", async (req, res) => {
    const entry = req.body
    const newDoctor = await createDoctor(entry)
    res.status(201).send(newDoctor)
})

app.post("/pharmacies", async (req, res) => {
    const entry = req.body
    const newPharm = await createPharmacy(entry)
    res.status(201).send(newPharm)
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