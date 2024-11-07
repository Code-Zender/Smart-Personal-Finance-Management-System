const Url ="localhost"
const express = require('express');
const path = require('path')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { log, error, warn } = require('./Wrapper.js');
const { connectDB, addUser, findUserByEmail, clearCollection, addTransaction, getTransactions, delTransaction, editTransaction } = require('./modules/database/db.js');
const { functions } = require('./modules/functions/functions.js')
const { saveInCache, readCache, removeCache, getCodeByEmail, isEmailInCache, timesOpend } = require('./modules/cache/cache.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '/modules/configs/config.json'), 'utf8'));
const app = express();
const port = 2555;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const get = require("./modules/initialize/get.js")
require('dotenv').config({ path: 'server/modules/configs/secrets/.env' });


let emailConfirm = false;
const nodemailer = require('nodemailer');
let approveNumber = 0;
const cors = require('cors');
const { exec, execSync, spawn } = require('child_process');
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Main')));
var clientID = process.env.GOOGLE_CLIENT_ID;
var clientSecret = process.env.GOOGLE_CLIENT_SECRET;
console.log(clientID)



get(app);
functions(app)
connectDB();

app.post('/register', async (req, res) => {
  const { name, fullName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  let date = new Date();
  const user = { name, fullName, email, password: hashedPassword, "Created": date };
  const userT = await findUserByEmail(email);

  if (!userT) {
    try {
      await addUser(user);
      const loginUrl = Url + 'confirm';
      const message = 'Welcome '+name+', your registration was successful! Click <a href="'+loginUrl+'">here</a> to confirm your Email.';
      sendEmail(email, "Confirm your E-mail", message);
      const token = jwt.sign({ email: user.email, name: user.name, userID: user._id.toString() }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).send('Error registering user');
    }
  } else {
    res.status(400).send('Email already in use');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).send('Cannot find user');
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email, userID: user._id.toString() }, 'your_jwt_secret', { expiresIn: '0.5h' });
      res.json({ token });
    } else {
      res.status(403).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

app.post('/wait', (req, res) => {
  res.send(emailConfirm);
});

app.post('/confirm', (req, res) => {
  if (req.body.emailConfirm === true) {
    emailConfirm = true;
  }
  res.send({ success: true });
});

app.post('/clear', async (req, res) => {
  try {
    console.error("--------------------Warning!--------------------");
    console.warn("             cleared all user-data!");
    console.warn("--------------------Warning!--------------------");
    await clearCollection('user-data');
    res.status(200).send('Collection cleared');
  } catch (error) {
    res.status(500).send('Error clearing collection');
  }
});

app.post('/prove', async (req, res) => {
  try {
    const { email, codeConfirm } = req.body;
    const isSet = await isEmailInCache(email);
    const user = await findUserByEmail(email);

    if (!isSet) {
      approveNumber = getRandomInt(10000, 999999);
      sendEmail(email, "Login Code", "Your Login Code is:" + approveNumber);
      saveInCache(email, approveNumber);
      res.send({ step: 'code sent' });
    } else {
      const code = await getCodeByEmail(email);
      if (toString(codeConfirm) === toString(code)) {
        const token = jwt.sign({ email: user.email, name: user.name, userID: user._id.toString() }, 'your_jwt_secret', { expiresIn: '1h' });
        res.send({ token });
        removeCache(email);
      } else {
        res.send({ step: 'invalid code' });
      }
    }
  } catch (error) {
    console.log(error);
    res.send(false);
  }
});


app.post('/getProfile', async (req, res) => {
  const { email } = req.body;
  res.json(await findUserByEmail(email));
});

passport.use(new GoogleStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: `${Url}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await findUserByEmail(profile.emails[0].value);
    console.log(profile)
    if (!user) {
      user = {
        name: profile.displayName,
        clientID: profile.clientID,
        email: profile.emails[0].value,
        googleId: profile.id,
        avatar: profile.photos[0].value,
        passwort: null
      };
      await addUser(user);
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await findUserByEmail(email);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
                           
app.use(session({ resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  (req, res, next) => {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account'
    })(req, res, next);
  }
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.session.destroy((err) => {
      res.redirect('/');
    });
  });
});

app.get('/profile', (req, res) => {
  console.log("tried but:")
  if (req.isAuthenticated()) {
    res.json(req.user);
    console.log(req.user)
    console.log(req)
  } else {
    console.log('Not authenticated')
    res.json('Not authenticated');
  }
});


app.listen(port, () => {
  console.log(`Server running at ${Url}`);
  console.log("Server started at " + new Date());
  runTime(serverStartTime = Date.now());
  logMessage("log","Server running at "+Url)
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function runTime(serverStartTime) {
  setInterval(() => {
    const seconds = Math.floor((Date.now() - serverStartTime) / 1000);
    // Add functionality as needed
  }, 1000);
}

async function sendEmail(to, subject, text) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'smart.financial.management.system@gmail.com',
      pass: '**** **** **** ****'
    }        
  });

  let mailOptions = {
    from: 'smart.financial.management.system@gmail.com',
    to: to,
    subject: subject,
    html: text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function logMessage(type, message) {
  const logEntry = {
      type,
      message,
      timestamp: new Date().toISOString(),
      data: null
  };
  const logFilePath = path.join(__dirname, 'logs.json');
  fs.readFile(logFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading log file:', err);
          return;
      }
  
      const logs = JSON.parse(data || '[]');
      
      logs.push(logEntry);
      fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (err) => {
          if (err) {
              console.error('Error writing to log file:', err);
          }
      });
  });
}
