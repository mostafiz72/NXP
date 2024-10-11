const express = require('express');
const app = express();
const cors = require('cors');  /// font end er sate conntion korar jonno cors pakej install korte hoy
const bcrypt = require('bcrypt');


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

app.use(
  cors({
    origin: "http://localhost:5173", // onno kono jaiga theke j amar data asbe sei jonno cors use korte hoy || font-end er sate backed er link connect korete cors use kra hoy
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true}));  // font end theke amar ki data aslo seita dekhar jonno ata use korete hobe



// API Links
app.get('/', (req, res)=> {
    res.set('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ name: "Mostafiz", message: "Login successfull"}));
});
app.post('/register', async (req, res)=> {
  
  try{

    const checkEmail = await prepare("SELECT * FROM userinfo WHERE email=?", [
      req.body.email,
    ]);

    if(checkEmail?.length){
      throw new Error (" This email is already registered.")
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);  // password encrypt kora hoye jonno bcrypt pakej install korte hobe

    const insertIntoDb = await prepare("INSERT INTO userinfo (fullName, email, password) VALUES (?,?,?)", [
      req.body.fullName,
      req.body.email,
      hashedPassword,
    ]);

    if(!insertIntoDb?.insertId){
      throw new Error ("Failed to register.");
    }


  res.status(200).json({ status: true, message: "Register Success"});
  }catch(error){
  res.status(200).json({ status: false, message: error?.message});
  }


  
});
// app.post('/login', (req, res)=> {
//   console.log(req.body); // ekhane req.body er mordhe fontend er all data asbe sei data niya amara ja ischa korte perbo
  
//     res.set('Content-Type', 'application/json');
//     if(req.body.email === email && req.body.pass === password){
//         res.status(200).send(JSON.stringify({ status: true, message: "Login successfull Redircting..."}));
//     } else {
//         res.status(200).send(JSON.stringify({ status: false, message: "Invalid email or password"}));
//     }
// })


// >>>>>>>>>>>>>>>>>>>>>>>>************************************>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>************************************>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// static vabe kora hoysilo j login page a asle ki hobe and ki hobe na


// <<<<<<<<<<<<<<<<<<<<<<<******************* Data base connection info ********************* >>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<<<<<<<<******************* Data base connection info ********************* >>>>>>>>>>>>>>>>>

const mysql = require('mysql2/promise');

// Create the connection pool. The pool-specific settings are the defaults
// ekhane database connecttion korlam and info gula dilam and >>>>>>>>>> ai info gula mysql2 theke neuya hoyse
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'useradmin',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});


/// query statement start here now>>>>>>>>>>>>>>>>>>>>>>>>>>
/// query statement start here now>>>>>>>>>>>>>>>>>>>>>>>>>>
async function query(query){  // query holo database language leskhear jaiga // mysql er sate deal korte ai function ta help korbe amader
  try {
    // For pool initialization, see above
    const [rows, fields] = await pool.query(query);  /// asob kicu mysql2 pakej er mordhe dauya ase
    // Connection is automatically released when query resolves
    return rows;
    
  } catch (err) {
    return err;
  }
}

// function parameter pass start here>>>>>>>>>>>>>>>>>>>>>>>>>>

// query(`SELECT * FROM userinfo where id = 2`) /// ekhan theke ja pass korebo seita query funciton er parameter hoye jabe and sei command onujayi data base k call korbe || and query ta holo ekta promiss
// .then((data)=>{
//   console.log(data);
  
// }).catch((err)=>{
//   console.log(err);
  
// })

// prepare statement start here now>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// prepare statement start here now>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

async function prepare(query, arr){  // query holo database language leskhear jaiga // mysql er sate deal korte ai function ta help korbe amader
  try {
    // For pool initialization, see above
    const [rows, fields] = await pool.execute(query, arr);  /// asob kicu mysql2 pakej er mordhe dauya ase
    // Connection is automatically released when query resolves
    return rows;
    
  } catch (err) {
    return err;
  }
}

// sql languages are here>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// "insert into userinfo (fullName, email, password)VALUES(?,?,?)", ["Mostafiz", "mostafiz4372@gamil.com", "1234"] === amara atar mardhome data pathai database a

prepare(`SELECT * FROM userinfo`) /// prepare use korle past kaj korbe and data check kore database a pathabe
.then((data)=>{
  console.log(data);
  
}).catch((err)=>{
  console.log(err);
  
})


// bcrypt customize you password // je ta password thakbe seitar sata ektra kicu value add hoye jabe jno keu bujte na pare
// bcrypting password start here >>>>>>>>>>> bcrypt ==== password k unkown a convart kora and >>>>>>>>>>>>>>>>>>> dcrypt ==== unkown kora password k abar ager password a feriye niye asha



// bcrypt.hash("1234mostafiz", 8)  /// ekhane example dekha hoyse kmne kaj kore
//   .then((data)=>{
//      console.log(data); // hashed password
//   }).catch((err)=>{
//      console.log(err);
//   })