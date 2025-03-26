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

export async function getReviewsTop() { //top 3 reviews for splash page - VC
    const [resultRows] = await pool.query(`with topDoctors as (SELECT doctor_id FROM reviews group by doctor_id ORDER BY avg(rating) DESC LIMIT 3)
                            select DB.first_name, DB.last_name, DB.specialty from 
                            DoctorBase as DB, topDoctors as TD where DB.doctor_id = TD.doctor_id`)
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

export async function createPharmacy(Company_Name,Address,Zip,Work_Hours,Email,PW) { //Work_Hours: req.body.Work_Hours, //json? -VC
    const workHoursString = JSON.stringify(Work_Hours); // Convert JSON object to string
    const [resultPharmacyCreate] = await pool.query(`
        INSERT INTO pharmacies (Company_Name, Address, Zip, Work_Hours, Email, PW) VALUES (?,?,?,?,?,SHA2(CONCAT(?),256));`
    , [Company_Name,Address,Zip,workHoursString,Email,PW])
    return resultPharmacyCreate
}

export async function createPill(Cost, Pill_Name, Pharm_ID, Dosage) {
    const [resultPillCreate] = await pool.query(`
        INSERT INTO pillbank (Cost, Pill_Name, Pharm_ID, Dosage) VALUES (?,?,?,?);`
    , [Cost, Pill_Name, Pharm_ID, Dosage])
    return resultPillCreate
}

export async function createExercise(Exercise_Name, Muscle_Group, Image, Exercise_Description, Sets, Reps) {
    const [resultExerciseCreate] = await pool.query(`
        INSERT INTO exercisebank (Exercise_Name, Muscle_Group, Image, Exercise_Description, Sets, Reps) VALUES (?,?,?,?,?,?);`
    , [Exercise_Name, Muscle_Group, Image, Exercise_Description, Sets, Reps])
    return resultExerciseCreate
}

export async function createForumPost(Patient_ID, Forum_Text) {
    const [resultFPostCreate] = await pool.query(`
        INSERT INTO forum_posts (Patient_ID, Forum_Text, Date_Posted) VALUES (?,?,CURRENT_DATE);`
    , [Patient_ID, Forum_Text])
    return resultFPostCreate
}

export async function createComment(Patient_ID, Forum_ID, Comment_Text) { //for forums above -VC
    const [resultCommentCreate] = await pool.query(`
        INSERT INTO comments (Patient_ID, Forum_ID, Comment_Text, Date_Posted) VALUES (?, ?, ?, CURRENT_DATE);`
    , [Patient_ID, Forum_ID, Comment_Text])
    return resultCommentCreate
}
//same idea for chatroom and messages should apply for above - VC

export async function createReveiw(Patient_ID, Doctor_ID, Review_Text, Rating) {
    const [resultReviewCreate] = await pool.query(`
        INSERT INTO reviews (Patient_ID, Doctor_ID, Review_Text, Date_Posted, Rating) VALUES (?,?,?,CURRENT_DATE,?);`
    , [Patient_ID, Doctor_ID, Review_Text, Rating])
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