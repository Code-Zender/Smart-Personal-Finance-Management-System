
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
function Local(){

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

module.exports = { Local }