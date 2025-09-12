require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const rateLimit = require('express-rate-limit');
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests. Try again later.' }
});

app.post('/send-email', emailLimiter, async (req, res) => {
  const secret = req.headers['x-api-key'];
  if (secret !== process.env.EMAIL_TRIGGER_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { to, firstName, promoCode } = req.body;
  if (!to) return res.status(400).json({ error: 'Missing "to" address' });

  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    templateId: process.env.SENDGRID_TEMPLATE_ID,
    dynamic_template_data: {
      firstName: firstName || 'Friend',
      promoCode: promoCode || 'GLOBAL2022'
    }
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true });
  } catch (err) {
    console.error('SendGrid error', err?.response?.body || err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server listening on port', PORT));
