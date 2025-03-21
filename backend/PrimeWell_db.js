import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

//make a file called .env if you dont and write each process.env. as ENTRY="value", and place the file at the root - VC
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST, 
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true
}).promise()

//GET DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with type GET

//the 5 request below return data from our only populated tables so far - VC
export async function getPatients() {
    const [resultRows] = await pool.query(`SELECT * FROM PatientBase`)
    return resultRows
}

export async function getDoctors() {
    const [resultRows] = await pool.query(`SELECT * FROM DoctorBase`)
    return resultRows
}

export async function getPharmacies() {
    const [resultRows] = await pool.query(`SELECT * FROM Pharmacies`)
    return resultRows
}

export async function getPills() {
    const [resultRows] = await pool.query(`SELECT * FROM PillBank`)
    return resultRows
}

export async function getTiers() {
    const [resultRows] = await pool.query(`SELECT * FROM Tiers`)
    return resultRows
}

export async function getExercises() {
    const [resultRows] = await pool.query(`SELECT * FROM ExerciseBank`)
    return resultRows
}

export async function getForumPosts() {
    const [resultRows] = await pool.query(`SELECT * FROM Forum_Posts`)
    return resultRows
}

export async function getComments_id(id) { //comments for specific forum post -VC
    const [resultRows] = await pool.query(`SELECT * FROM Comments WHERE Forum_ID = ?`, [id])
    return resultRows
}

export async function getReviews() {
    const [resultRows] = await pool.query(`SELECT * FROM Reviews`)
    return resultRows
}

export async function getReviewsTop() { //top 3 revies for splash page - VC
    const [resultRows] = await pool.query(`SELECT * FROM reviews ORDER BY Rating DESC LIMIT 3`)
    return resultRows
}

// 3 below are for pass word authentication, check what was entered compared to what is stored, could add post for attempts - VC
export async function getPatientAuth(email) {
    const [resultRows] = await pool.query(`SELECT PW FROM patientbase WHERE Email = ?`,
        [email]
    )
    return resultRows
}

export async function getDoctorAuth(email) {
    const [resultRows] = await pool.query(`SELECT PW FROM doctorbase WHERE Email = ?`,
        [email]
    )
    return resultRows
}

export async function getPharmAuth(email) {
    const [resultRows] = await pool.query(`SELECT PW FROM pharmacies WHERE Email = ?`,
        [email]
    )
    return resultRows
}

//ADD DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with type POST
// Add to db via a new id, can also be done with SET @valI = (SELECT COUNT(*) FROM table);
// - VC

export async function createPatient(entry) {
    let timeStamp = new Date();
    const [resultPatientCreate] = await pool.query(`
        SET @valI = (SELECT COUNT(*) FROM patientbase);
        INSERT INTO patientbase SET \`Patient_ID\` = @valI+1, ?, \`Last_update\` = ?, \`Create_Date\` = ?;`
    , [entry, timeStamp, timeStamp])
    return resultPatientCreate
}

export async function createDoctor(entry) { //add tiers with doc? - VC
    let timeStamp = new Date();
    const [resultDoctorCreate] = await pool.query(`
        SET @valI = (SELECT COUNT(*) FROM doctorbase);
        INSERT INTO patientbase SET \`Doctor_ID\` = @valI+1, ?, \`Last_update\` = ?, \`Create_Date\` = ?;`
    , [entry, timeStamp, timeStamp])
    return resultDoctorCreate
}

export async function createPharmacy(entry) { //Work_Hours: req.body.Work_Hours, //json? -VC
    let timeStamp = new Date();
    const [resultPharmacyCreate] = await pool.query(`
        SET @valI = (SELECT COUNT(*) FROM pharmacies);
        INSERT INTO pharmacies SET \`Pharm_ID\` = @valI+1, ?, \`Last_update\` = ?, \`Create_Date\` = ?;`
    , [entry, timeStamp, timeStamp])
    return resultPharmacyCreate
}

export async function createPill(entry) {
    let timeStamp = new Date();
    const [resultPillCreate] = await pool.query(`
        SET @valI = (SELECT COUNT(*) FROM pillbank);
        INSERT INTO pillbank SET \`Pill_ID\` = @valI+1, ?, \`Last_update\` = ?, \`Create_Date\` = ?;`
    , [entry, timeStamp, timeStamp])
    return resultPilltCreate
}

export async function createExercise(entry) {
    let timeStamp = new Date();
    const [resultExerciseCreate] = await pool.query(`
        SET @valI = (SELECT COUNT(*) FROM exercisebank);
        INSERT INTO exercisebank SET \`Exercise_ID\` = @valI+1, ?, \`Last_update\` = ?, \`Create_Date\` = ?;`
    , [entry, timeStamp, timeStamp])
    return resultExerciseCreate
}

export async function createForumPost(entry) {
    let timeStamp = new Date();
    const [resultFPostCreate] = await pool.query(`
        SET @valI = (SELECT COUNT(*) FROM forum_posts);
        INSERT INTO forum_posts SET \`Forum_ID\` = @valI+1, ?, \`Last_update\` = ?, \`Create_Date\` = ?;`
    , [entry, timeStamp, timeStamp])
    return resultFPostCreate
}

export async function createComment(entry) { //for forums above -VC
    let timeStamp = new Date();
    const [resultCommentCreate] = await pool.query(`
        SET @valI = (SELECT COUNT(*) FROM comments);
        INSERT INTO comments SET \`Comment_ID\` = @valI+1, ?, \`Last_update\` = ?, \`Create_Date\` = ?;`
    , [entry, timeStamp, timeStamp])
    return resultCommentCreate
}
//same idea for chatroom and messages should apply for above - VC

export async function createReveiw(entry) {
    let timeStamp = new Date();
    const [resultReviewCreate] = await pool.query(`
        SET @valI = (SELECT COUNT(*) FROM reviews);
        INSERT INTO reviews SET \`Review_ID\` = @valI+1, ?, \`Last_update\` = ?, \`Create_Date\` = ?;`
    , [entry, timeStamp, timeStamp])
    return resultReviewCreate
}

//UPDATE DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with tyoe PATCH
//update based on a given id - VC

export async function UpdatePatientInfo(id, entry) {
    let timeStamp = new Date();
    const [returnResult] = await pool.query(`
        UPDATE patientbase SET ?, \`Last_Update\` = ? Where Patient_ID = ?;`
    , [entry, timeStamp, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

export async function addPatientDoc(id, doc_id) {
    let timeStamp = new Date();
    const [returnResult] = await pool.query(`
        UPDATE patientbase SET \`Doctor_ID\` = ?, \`Last_Update\` = ? Where Patient_ID = ?;`
    , [doc_id, timeStamp, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

export async function rmPatientDoc(id) {
    let timeStamp = new Date();
    const [returnResult] = await pool.query(`
        UPDATE patientbase SET \`Doctor_ID\` = NULL, \`Last_Update\` = ? Where Patient_ID = ?;`
    , [timeStamp, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

export async function UpdateDoctorInfo(id, entry) {
    let timeStamp = new Date();
    const [returnResult] = await pool.query(`
        UPDATE doctorbase SET ?, \`Last_Update\` = ? Where Doctor_ID = ?;`
    , [entry, timeStamp, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

export async function UpdatePillInfo(id, entry) {
    let timeStamp = new Date();
    const [returnResult] = await pool.query(`
        UPDATE pillbank SET ?, \`Last_Update\` = ? Where Pill_ID = ?;`
    , [entry, timeStamp, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

//REMOVE DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with tyoe DELETE
// delete based on a given id - VC

export async function deletePatient(id) {
    const [deleteResult] = await pool.query(`DELETE FROM patientbase WHERE Patient_ID = ?;`
    , [id])
    console.log("Database delete result:", deleteResult);
    return deleteResult
}

export async function deleteDoctor(id) {
    const [deleteResult] = await pool.query(`DELETE FROM doctorbase WHERE Doctor_ID = ?;`
    , [id])
    console.log("Database delete result:", deleteResult);
    return deleteResult
}

export async function deletePill(id) {
    const [deleteResult] = await pool.query(`DELETE FROM pillbank WHERE Pill_ID = ?;`
    , [id])
    console.log("Database delete result:", deleteResult);
    return deleteResult
}