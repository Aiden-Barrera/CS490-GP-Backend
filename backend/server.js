// install express and nodemon if you haven't already - VC
const express = require('express');
const mysql = require('mysql');
app=express();
var bodyParser = require('body-parser');

const conn = require('./PrimeWell_db');

//app.use(express.json)
app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origon, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
    next();
});

app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json()) 

app.listen(3000, ()=>{
    console.log("on port 3000");
    conn.connect((err)=>{
        if(err) throw err;
        console.log('connection successful');

    })
});

//GET DATA ----------------------------------------------------------------------------------------------

//the 5 request below return data from our only populated tables so far - VC
app.get('/patient', (req, res)=>{
    //res.set('Content-Type', 'application/json');
    var query = `
    SELECT * FROM primewell_clinic.patientbase;
    `
    conn.query(query, (err, result)=>{
        if(err) throw err;
        res.send(result);
        res.end();
    })
});

app.get('/doctor', (req, res)=>{
    //res.set('Content-Type', 'application/json');
    var query = `
    SELECT * FROM primewell_clinic.doctorbase;
    `
    conn.query(query, (err, result)=>{
        if(err) throw err;
        res.send(result);
        res.end();
    })
});

app.get('/pharmacies', (req, res)=>{
    //res.set('Content-Type', 'application/json');
    var query = `
    SELECT * FROM primewell_clinic.pharmacies;
    `
    conn.query(query, (err, result)=>{
        if(err) throw err;
        res.send(result);
        res.end();
    })
});

app.get('/pharmacies', (req, res)=>{
    //res.set('Content-Type', 'application/json');
    var query = `
    SELECT * FROM primewell_clinic.pharmacies;
    `
    conn.query(query, (err, result)=>{
        if(err) throw err;
        res.send(result);
        res.end();
    })
});

app.get('/pillbank', (req, res)=>{
    //res.set('Content-Type', 'application/json');
    var query = `
    SELECT * FROM primewell_clinic.pillbank;
    `
    conn.query(query, (err, result)=>{
        if(err) throw err;
        res.send(result);
        res.end();
    })
});


app.get('/tiers', (req, res)=>{
    //res.set('Content-Type', 'application/json');
    var query = `
    SELECT * FROM primewell_clinic.pharmacies;
    `
    conn.query(query, (err, result)=>{
        if(err) throw err;
        res.send(result);
        res.end();
    })
});

app.get('/exercisebank', (req, res)=>{
    //res.set('Content-Type', 'application/json');
    var query = `
    SELECT * FROM primewell_clinic.exercisebank;
    `
    conn.query(query, (err, result)=>{
        if(err) throw err;
        res.send(result);
        res.end();
    })
});

//ADD DATA ----------------------------------------------------------------------------------------------

// Add to pillbank via a new id, can also be done with SET @valI = (SELECT COUNT(*) FROM primewell_clinic.pillbank);
// - VC
app.post('/pillbank/:id', (req, res)=>{
    let timeStamp = new Date();
    let entry = {
    Pill_ID: req.params.id,
    Cost: req.body.Cost,
    Pill_Name: req.body.last_name,
    email: req.body.email,
    Pharma_ID: req.body.Pharma_ID,
    Dosage:  req.body.Dosage,
    last_update: timeStamp,
    create_date: timeStamp
    };
    let query = `INSERT INTO primewell_clinic.pillbank SET ?;`;
    conn.query(query, [entry], (err, result)=>{
        if(err) throw err;
        res.send(result);
        res.end();
    })
});


//UPDATE DATA ----------------------------------------------------------------------------------------------

//update based on a given id - VC
app.patch('/pillbank/:id', (req, res)=>{
    let timeStamp = new Date();
    let entry = req.body;
    let query = `UPDATE primewell_clinic.pillbank SET ?, \`Last_Update\` = ? Where Pill_ID = ?;`;
    conn.query(query, [entry, timeStamp, Number(req.params.id)], 
    (err, result)=>{
        if(err) throw err;
        res.send(result);
        res.end();
    })
});

//REMOVE DATA ----------------------------------------------------------------------------------------------

// delete based on a given id - VC
app.delete('/pillbank/:id', (req, res)=>{
    let query = `DELETE FROM primewell_clinic.pillbank WHERE Pill_ID = ?;`;
    conn.query(query, [req.params.id], (err, result)=>{
        if(err)
            throw err;
        res.send(result);
        res.end();
    })
});