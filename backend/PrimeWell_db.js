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
export async function getPatients(id) {
    const [resultRows] = await pool.query(`SELECT * FROM PatientBase WHERE Patient_ID = ?`, [id])
    return resultRows
}

export async function getDoctors(id) {
    const [resultRows] = await pool.query(`SELECT * FROM DoctorBase WHERE Doctor_ID = ?`, [id])
    return resultRows
}

export async function getDoctorSchedule(id) {
    const [resultRows] = await pool.query(`SELECT * FROM doctorschedule WHERE Doctor_ID = ?`, [id])
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

export async function getTiers(id) {
    const [resultRows] = await pool.query(`SELECT * FROM Tiers WHERE Doctor_ID = ?`)
    return resultRows
}

export async function getExercises() {
    const [resultRows] = await pool.query(`SELECT * FROM ExerciseBank`)
    return resultRows
}

export async function getRegiment(id) {
    const [resultRows] = await pool.query(`SELECT * FROM appointments WHERE Patient_ID = ?`, [id])
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

export async function getReviewsTop() { //top 3 reviews for splash page - VC
    const [resultRows] = await pool.query(`SELECT * FROM reviews ORDER BY Rating DESC LIMIT 3`)
    return resultRows
}

export async function getSurvey(id) { // get patient's recent surveys by recent date
    const [resultRows] = await pool.query(`SELECT * FROM patientdailysurvey WHERE Patient_ID = ? ORDER BY Survey_Date DESC`)
    return resultRows
}

export async function getAppointmentsPatient(id) {
    const [resultRows] = await pool.query(`SELECT * FROM appointments WHERE Patient_ID = ?`, [id])
    return resultRows
}

export async function getAppointmentsDoctor(id) {
    const [resultRows] = await pool.query(`SELECT * FROM appointments WHERE Doctor_ID = ?`, [id])
    return resultRows
}

export async function getPrescription(id) {
    const [resultRows] = await pool.query(`SELECT * FROM prescription WHERE Patient_ID = ?`, [id])
    return resultRows
}

export async function getPreliminaries(id) { //order by for most recent
    const [resultRows] = await pool.query(`SELECT * FROM preliminaries WHERE Patient_ID = ? ORDER BY Create_Date DESC`, [id])
    return resultRows
}

export async function getChatMesseges(id) { //order by for most recent
    const [resultRows] = await pool.query(`SELECT * FROM messages WHERE Chatroom_ID = ? ORDER BY Sent_At DESC`, [id])
    return resultRows
}

// 3 below are for pass word authentication, check what was entered compared to what is stored, could add post for attempts - VC
export async function getPatientAuth(email, pw) {
    const [resultRows] = await pool.query(`SELECT * FROM PatientBase WHERE Email = ? AND PW = SHA2(CONCAT(?),256)`,
        [email, pw]
    )
    return resultRows[0]
}

export async function getDoctorAuth(email, pw) {
    const [resultRows] = await pool.query(`SELECT * FROM DoctorBase WHERE Email = ? AND PW = SHA2(CONCAT(?),256)`,
        [email, pw]
    )
    return resultRows[0]
}

export async function getPharmAuth(email, pw) {
    const [resultRows] = await pool.query(`SELECT * FROM Pharmacies WHERE Email = ? AND PW = SHA2(CONCAT(?),256)`,
        [email, pw]
    )
    return resultRows[0]
}

//ADD DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with type POST
// Add to db via a new id, can also be done with SET @valI = (SELECT COUNT(*) FROM table);
// - VC

export async function genereateAudit(User_ID, User_type, Event_Type, Event_Details){
    const [resultPatientCreate] = await pool.query(`
        INSERT INTO auditlog (UserID, UserType, Event_Type, Event_Details) VALUES (?, ?, ?, ?);`
    , [User_ID, User_type, Event_Type, Event_Details])
    return resultPatientCreate
}

export async function createPatient(Pharm_ID, First_Name, Last_Name, Email, Phone, PW, Address, Zip, Doctor_ID) {
    const [resultPatientCreate] = await pool.query(`
        INSERT INTO PatientBase (Pharm_ID, First_Name, Last_Name, Email, Phone, PW, Address, Zip, Doctor_ID) VALUES (?, ?, ?, ?, ?, SHA2(CONCAT(?),256), ?, ?, ?);`
    , [Pharm_ID, First_Name, Last_Name, Email, Phone, PW, Address, Zip, Doctor_ID])
    return resultPatientCreate
}

export async function createDoctor(License_Serial,First_Name,Last_Name,Specialty,Email,Phone,PW,Availability) { //add tiers with doc? - VC
    const [resultDoctorCreate] = await pool.query(`
        INSERT INTO DoctorBase (License_Serial, First_Name, Last_Name, Specialty, Email, Phone, PW, Availability) VALUES (?,?,?,?,?,?,SHA2(CONCAT(?),256),?);`
    , [License_Serial,First_Name,Last_Name,Specialty,Email,Phone,PW,Availability])
    return resultDoctorCreate
}

export async function createDoctorSchedule(entry) {
    const [resultPillCreate] = await pool.query(`INSERT INTO doctorschedules SET ?;`, [entry])
    return resultPillCreate
}

export async function createPharmacy(Company_Name,Address,Zip,Work_Hours,Email,PW) { //Work_Hours: req.body.Work_Hours, //json? -VC
    const workHoursString = JSON.stringify(Work_Hours); // Convert JSON object to string
    const [resultPharmacyCreate] = await pool.query(`
        INSERT INTO pharmacies (Company_Name, Address, Zip, Work_Hours, Email, PW) VALUES (?,?,?,?,?,SHA2(CONCAT(?),256));`
    , [Company_Name,Address,Zip,workHoursString,Email,PW])
    return resultPharmacyCreate
}

export async function createPill(entry) {
    const [resultPillCreate] = await pool.query(`INSERT INTO pillbank SET ?;`, [entry])
    return resultPillCreate
}

export async function createExercise(entry, filename) {
    const [resultExerciseCreate] = await pool.query(`INSERT INTO primewell_clinic.exercisebank SET ?, Image = ?;`
    , [entry, filename])
    return resultExerciseCreate
}

export async function createRegiment(entry) {
    const [resultReviewCreate] = await pool.query(`INSERT INTO regiments SET ?;`, [entry])
    return resultReviewCreate
}

export async function createForumPost(entry) {
    const [resultFPostCreate] = await pool.query(`INSERT INTO forum_posts SET ?;`, [entry])
    return resultFPostCreate
}

export async function createComment(entry) { //for forums above -VC
    const [resultCommentCreate] = await pool.query(`INSERT INTO comments SET ?;`, [entry])
    return resultCommentCreate
}

//same idea for chatroom and messages should apply for above - VC
export async function createChatroom(entry) {
    const [resultChatCreate] = await pool.query(`INSERT INTO chatrooms SET ?;`, [entry])
    return resultChatCreate
}

export async function createChatMsg(entry) { //for chatroom above -VC
    const [resultMsgCreate] = await pool.query(`INSERT INTO messages SET ?;`, [entry])
    return resultMsgCreate
}

export async function createAppointment(entry) {
    const [resultReviewCreate] = await pool.query(`INSERT INTO appointments SET ?;`, [entry])
    return resultReviewCreate
}

export async function createPerscription(entry) {
    const [resultReviewCreate] = await pool.query(`INSERT INTO perscription SET ?;`, [entry])
    return resultReviewCreate
}

export async function createReveiw(entry) {
    const [resultReviewCreate] = await pool.query(`INSERT INTO reviews SET ?;`, [entry])
    return resultReviewCreate
}

export async function createSurvey(entry) {
    const [resultReviewCreate] = await pool.query(`INSERT INTO patientdailysurvey SET ?;`, [entry])
    return resultReviewCreate
}

export async function createPayment(entry) {
    const [resultChatCreate] = await pool.query(`INSERT INTO payments SET ?;`, [entry])
    return resultChatCreate
}

//UPDATE DATA ----------------------------------------------------------------------------------------------
// All below should have an addtional query to auditlog with tyoe PATCH
//update based on a given id - VC

export async function UpdatePatientInfo(id, entry) {
    const [returnResult] = await pool.query(`
        UPDATE patientbase SET ?, \`Last_Update\` = CURRENT_TIMESTAMP Where Patient_ID = ?;`
    , [entry, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

export async function addPatientDoc(id, doc_id) {
    const [returnResult] = await pool.query(`
        UPDATE patientbase SET \`Doctor_ID\` = ?, \`Last_Update\` = CURRENT_TIMESTAMP Where Patient_ID = ?;`
    , [doc_id, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

export async function rmPatientDoc(id) {
    const [returnResult] = await pool.query(`
        UPDATE patientbase SET \`Doctor_ID\` = NULL, \`Last_Update\` = CURRENT_TIMESTAMP Where Patient_ID = ?;`
    , [id])
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

export async function UpdateDoctorSchedule(id, entry) {
    let timeStamp = new Date();
    const [returnResult] = await pool.query(`
        UPDATE doctorschedules SET ?, \`Last_Update\` = ? Where Doctor_ID = ?;`
    , [entry, timeStamp, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

export async function UpdateApptInfo(id, entry) {
    let timeStamp = new Date();
    const [returnResult] = await pool.query(`
        UPDATE appointments SET ?, \`Last_Update\` = ? Where Appointment_ID = ?;`
    , [entry, timeStamp, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

export async function UpdatePerscriptionInfo(id, entry) {
    let timeStamp = new Date();
    const [returnResult] = await pool.query(`
        UPDATE perscription SET ?, \`Last_Update\` = ? Where Perscription_ID = ?;`
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

export async function UpdateRegiment(id, entry) {
    let timeStamp = new Date();
    const [returnResult] = await pool.query(`
        UPDATE regiments SET ?, \`Last_Update\` = ? Where Patient_ID = ?;`
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

export async function deleteAppointment(id) {
    const [deleteResult] = await pool.query(`DELETE FROM appointments WHERE Appointment_ID = ?;`
    , [id])
    console.log("Database delete result:", deleteResult);
    return deleteResult
}

export async function deleteRegiment(id) {
    const [deleteResult] = await pool.query(`DELETE FROM regiments WHERE Patient_ID = ?;`
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

export async function deleteDoctorSchedule(id) {
    const [deleteResult] = await pool.query(`DELETE FROM doctorschedules WHERE Doctor_ID = ?;`
    , [id])
    console.log("Database delete result:", deleteResult);
    return deleteResult
}

export async function deletePerscription(id) {
    const [deleteResult] = await pool.query(`DELETE FROM perscription WHERE Perscription_ID = ?;`
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

export async function deleteComment(id) {
    const [deleteResult] = await pool.query(`DELETE FROM comments WHERE Comment_ID = ?;`
    , [id])
    console.log("Database delete result:", deleteResult);
    return deleteResult
}

export async function deleteForumPost(id) {
    const [deleteResult] = await pool.query(`
        DELETE FROM comments WHERE Forum_ID = ?;
        DELETE FROM forum_post WHERE Forum_ID = ?;`
    , [id, id])
    console.log("Database delete result:", deleteResult);
    return deleteResult
}