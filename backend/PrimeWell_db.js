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
    const [resultRows] = await pool.query(`SELECT * FROM PatientBase WHERE Patient_ID = ?`, [id]) // Modify column data to return back bare minimum, don't include sensitive info
    return resultRows
}

export async function getDoctors(id) {
    const [resultRows] = await pool.query(`SELECT doctor_id, first_name, last_name, specialty, availability FROM DoctorBase WHERE Doctor_ID = ?`, [id]) // Modify column data to return back bare minimum, don't include sensitive info
    return resultRows
}

export async function getDoctorSchedule(id) {
    const [resultRows] = await pool.query(`SELECT * FROM doctorschedule WHERE Doctor_ID = ?`, [id]) 
    return resultRows
}

export async function getPharmacies() {
    const [resultRows] = await pool.query(`SELECT * FROM Pharmacies`) // Modify column data to return back bare minimum, don't include sensitive info
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
    const [resultRows] = await pool.query(`SELECT * FROM appointments WHERE Patient_ID = ?`, [id]) // Modify column data to return back bare minimum, don't include sensitive info
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

export async function getSurvey(id) { // get patient's recent surveys by recent date
    const [resultRows] = await pool.query(`SELECT * FROM patientdailysurvey WHERE Patient_ID = ? ORDER BY Survey_Date DESC`) // Modify column data to return back bare minimum, don't include sensitive info
    return resultRows
}

export async function getAppointmentsPatient(id) {
    const [resultRows] = await pool.query(`SELECT * FROM appointments WHERE Patient_ID = ?`, [id]) // Modify column data to return back bare minimum, don't include sensitive info
    return resultRows
}

export async function getAppointmentsDoctor(id) {
    const [resultRows] = await pool.query(`SELECT * FROM appointments WHERE Doctor_ID = ?`, [id]) // Modify column data to return back bare minimum, don't include sensitive info
    return resultRows
}

export async function getPrescription(id) {
    const [resultRows] = await pool.query(`SELECT * FROM prescription WHERE Patient_ID = ?`, [id]) // Modify column data to return back bare minimum, don't include sensitive info
    return resultRows
}

export async function getPreliminaries(id) { //order by for most recent
    const [resultRows] = await pool.query(`SELECT * FROM preliminaries WHERE Patient_ID = ? ORDER BY Create_Date DESC`, [id]) // Modify column data to return back bare minimum, don't include sensitive info
    return resultRows
}

export async function getChatMesseges(id) { //order by for most recent
    const [resultRows] = await pool.query(`SELECT * FROM messages WHERE Chatroom_ID = ? ORDER BY Sent_At DESC`, [id]) // Modify column data to return back bare minimum, don't include sensitive info
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

export async function LogAttempt(User_ID, User_type, Success_Status){
    const [login] = await pool.query(`
        INSERT INTO auditlog (UserEmail, UserType, Success_Status) VALUES (?, ?, ?);`
    , [User_ID, User_type, Success_Status])
    return login
}

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

export async function createDoctorTiers(Doctor_ID, Cost) {
    const [resultPillCreate] = await pool.query(`
        INSERT INTO tiers (Doctor_ID, Tier, Service, Cost) VALUES (?, 'Basic', 'General Consulatation', ?);
        INSERT INTO tiers (Doctor_ID, Tier, Service, Cost) VALUES (?, 'Plus', 'Elevated Servicing', ?);
        INSERT INTO tiers (Doctor_ID, Tier, Service, Cost) VALUES (?, 'Premium', 'Premium Doctor-Patient Facilities', ?);`, 
        [Doctor_ID, Cost, Doctor_ID, Cost * 1.25, Doctor_ID, Cost * 1.50])
    return resultPillCreate
}

export async function createDoctorSchedule(Doctor_ID, Doctor_Schedule) {
    const [resultPillCreate] = await pool.query(`INSERT INTO doctorschedules (Doctor_ID, Doctor_Schedule) VALUES (?, ?);`, [Doctor_ID, Doctor_Schedule])
    return resultPillCreate
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

export async function createRegiment(Patient_ID, Regiment) {
    const [resultExerciseCreate] = await pool.query(`
        INSERT INTO exercisebank (Patient_ID, Regiment) VALUES (?,?);`
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
export async function createChatroom(Chatroom_Name) {
    const [resultChatCreate] = await pool.query(`INSERT INTO chatrooms (Chatroom_Name), VALUES(?);`, [Chatroom_Name])
    return resultChatCreate
}

export async function createChatMsg(Chatroom_ID, SenderID, SenderType, Message) { //for chatroom above -VC
    const [resultMsgCreate] = await pool.query(`INSERT INTO messages (Chatroom_ID, SenderID, SenderType, Message) 
        VALUES (?, ?, ?, ?);`, [Chatroom_ID, SenderID, SenderType, Message])
    return resultMsgCreate
}

export async function createAppointment(Patient_ID, Doctor_ID, Appt_Date, Doctors_Feedback, Tier_ID) {
    const [resultReviewCreate] = await pool.query(`INSERT INTO appointments (Patient_ID, Doctor_ID, Date_Scheduled,
        Appt_Date, Doctors_Feedback, Tier_ID) VALUES (?, ?, CURRENT_DATE, ?, ?, ?);`, [Patient_ID, Doctor_ID, Appt_Date, Doctors_Feedback, Tier_ID])
    return resultReviewCreate
}

export async function createPreliminary(Patient_ID, Symptoms) {
    const [resultReviewCreate] = await pool.query(`INSERT INTO preliminaries (Patient_ID, Symptoms) 
        VALUES (?, ?, CURRENT_DATE, ?, ?, ?);`, [Patient_ID, Symptoms])
    return resultReviewCreate
}

export async function createPerscription(Patient_ID, Doctor_ID, Pill_ID, Quantity) {
    const [resultPrescriptionCreate] = await pool.query(`INSERT INTO perscription (Patient_ID, Doctor_ID, Pill_ID, Quantity) 
        VALUES (?, ?, ?, ?);`, [Patient_ID, Doctor_ID, Pill_ID, Quantity])
    return resultPrescriptionCreate
}

export async function createReveiw(Patient_ID, Doctor_ID, Review_Text, Rating) {
    const [resultReviewCreate] = await pool.query(`
        INSERT INTO reviews (Patient_ID, Doctor_ID, Review_Text, Date_Posted, Rating) VALUES (?,?,?,CURRENT_DATE,?);`
    , [Patient_ID, Doctor_ID, Review_Text, Rating])
    return resultReviewCreate
}

export async function createReveiw(Patient_ID, Doctor_ID, Review_Text, Rating) {
    const [resultReviewCreate] = await pool.query(`INSERT INTO reviews (Patient_ID, Doctor_ID, Date_Posted, Review_Text, Rating) 
        VALUES (?, ?, CURRENT_DATE, ?, ?);`, [Patient_ID, Doctor_ID, Review_Text, Rating])
    return resultReviewCreate
}

export async function createSurvey(Patient_ID, Weight, Caloric_Intake, Water_Intake, Mood) {
    const [resultReviewCreate] = await pool.query(`INSERT INTO patientdailysurvey (Patient_ID, Weight, Caloric_Intake, Water_Intake, Mood)
        VALUES (?, ?, ?, ?, ?);`, [Patient_ID, Weight, Caloric_Intake, Water_Intake, Mood])
    return resultReviewCreate
}

export async function createPayment(Patient_ID, Card_Number, Related_ID, Payment_Type, Payment_Status) {
    const [resultChatCreate] = await pool.query(`INSERT INTO payments (Patient_ID, Card_Number, Related_ID, Payment_Type, Payment_Status)
        VALUES (?, ?, ?, ?, ?);`, [Patient_ID, Card_Number, Related_ID, Payment_Type, Payment_Status])
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
    const [returnResult] = await pool.query(`
        UPDATE doctorbase SET ?, \`Last_Update\` = CURRENT_TIMESTAMP Where Doctor_ID = ?;`
    , [entry, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

export async function UpdateDoctorSchedule(id, entry) {
    const [returnResult] = await pool.query(`
        UPDATE doctorschedules SET ?, \`Last_Update\` = CURRENT_TIMESTAMP Where Doctor_ID = ?;`
    , [entry, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

export async function UpdateApptInfo(id, entry) {
    const [returnResult] = await pool.query(`
        UPDATE appointments SET ?, \`Last_Update\` = CURRENT_TIMESTAMP Where Appointment_ID = ?;`
    , [entry, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

export async function UpdatePerscriptionInfo(id, entry) {
    const [returnResult] = await pool.query(`
        UPDATE perscription SET ?, \`Last_Update\` = CURRENT_TIMESTAMP Where Perscription_ID = ?;`
    , [entry, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

export async function UpdatePillInfo(id, entry) {
    const [returnResult] = await pool.query(`
        UPDATE pillbank SET ?, \`Last_Update\` = CURRENT_TIMESTAMP Where Pill_ID = ?;`
    , [entry, id])
    console.log("Database update result:", returnResult);
    return returnResult
}

export async function UpdateRegiment(id, entry) {
    const [returnResult] = await pool.query(`
        UPDATE regiments SET ?, \`Last_Update\` = CURRENT_TIMESTAMP Where Patient_ID = ?;`
    , [entry, id])
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

export async function deleteDoctorTiers(id) {
    const [deleteResult] = await pool.query(`DELETE FROM tiers WHERE Doctor_ID = ?;`
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