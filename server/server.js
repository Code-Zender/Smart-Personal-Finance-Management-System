const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectDB, addUser, findUserByEmail, clearCollection, addTransaction, getTransactions } = require('./db');
const { saveInCache, readCache, removeCache, getCodeByEmail, isEmailInCache } = require('./cache.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../Main/src/config.json'), 'utf8'));
const app = express();
const port = process.env.PORT || 3000;  // Port aus Umgebungsvariablen oder Standardport 3000
let emailConfirm = false;
const nodemailer = require('nodemailer');
let approveNumber = 0;
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Main')));

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
      const loginUrl = `http://${process.env.SERVER_HOST}:${port}/confirm`;  // Dynamische URL abhängig von SERVER_HOST
      const message = `Welcome ${name}, your registration was successful! Click <a href="${loginUrl}">here</a> to confirm your Email.`;
      console.log("A");
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

      const token = jwt.sign({ email: user.email, name: user.name, userID: user._id.toString() }, 'your_jwt_secret', { expiresIn: '1h' });

      res.json({ token });
    } else {
      res.status(403).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

app.post('/wait', async (req, res) => {
  if (emailConfirm) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.post('/config', async (req, res) => {
  if (req.body.emailConfirm === true) {
    emailConfirm = true;
  }
  res.send({ success: true });
});

app.post('/clear', async (req, res) => {
  try {
    await clearCollection('user-data');
    res.status(200).send('Collection cleared');
  } catch (error) {
    res.status(500).send('Error clearing collection');
  }
});
app.post('/prove', async (req, res) => {
  try {

    email = req.body.email;
    isSet = await isEmailInCache(email);
    if (!isSet) {
      approveNumber = getRandomInt(10000, 999999);
      console.log(email, approveNumber);
      sendEmail(email, "Login Code", "Your Login Code is:" + approveNumber);
      saveInCache(email, approveNumber);
    } else {

      code = await getCodeByEmail(email);
      if (req.body.codeConfirm.toString() === code.toString()) {
        res.send(true);
        removeCache(email);
      }
    }

  } catch (error) {
    console.log(error);
    res.send(false);

  }

});

app.post('/addFinances', async (req, res) => {
  try {
    const transaction = req.body;
    await addTransaction(transaction);
    res.status(200).send('Transaction successfully added');
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).send('Error adding transaction');
  }

});

app.post('/getTransactions', async (req, res) => {
  const { id } = req.body;
  const transactions = await getTransactions(id);
  res.json(transactions);

});


app.listen(port, () => {
  console.log(`Server running at http://${process.env.SERVER_HOST}:${port}/`);
  console.log("Server started at " + new Date());
  runTime(Date.now());
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.root));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.login));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.register));
});

app.get('/config', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.config));
});

app.get('/wait', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.wait));
});

app.get('/confirm', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.confirm));
});
app.get('/prove', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.prove));
});
app.get('/charts', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.charts));
});
app.get('/addFinances', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.addFinances));
});
app.get('/displayData', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.displayData));
});
app.get('/profileUrl', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.profileUrl));
});
app.get('/aboutUS', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.aboutUS));
});
app.get('/aboutThisProgramm', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.aboutThisProgramm));
});
app.get('/privacyPolicy', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.privacyPolicy));
});
app.get('/ContactUS', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.ContactUS));
});


function runTime(serverStartTime) {
  setInterval(() => {
    const seconds = Math.floor((Date.now() - serverStartTime) / 1000);
    console.log(`Server running for ${seconds} seconds`);
  }, 1000);
}

async function sendEmail(to, subject, text) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'marc.falkensee@gmail.com',
      pass: 'rmvg bgpb xhwe sdxb'
    }
  });

  let mailOptions = {
    from: 'marc.falkensee@gmail.com',
    to: to,
    subject: subject,
    html: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.log('Error sending email:', error);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
