const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Allow all origins or specify your frontend's origin
app.use(cors({ origin: '*' }));
// app.use(cors({ origin: 'https://your-frontend.com' }));

// Middleware
app.use(bodyParser.json());

// Mailchimp credentials

// const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
// const LIST_ID = process.env.LIST_ID;
// const SERVER_PREFIX = process.env.SERVER_PREFIX;

const MAILCHIMP_API_KEY = '4146d906bea7491a0f002ab2a84be3fd-us19';
const LIST_ID = '756d77bfca';
const SERVER_PREFIX = 'us19';

app.post('/subscribe', async (req, res) => {
  const { firstName, email } = req.body;

  if (!email || !firstName) {
    return res.status(400).json({ message: 'First name and email are required' });
  }

  const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  try {
    // Step 1: Add subscriber to the list
    const response = await axios.post(
      url,
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: { FNAME: firstName }, // Assuming "FNAME" is configured in Mailchimp
        tags: ['oneclick-branchify'], // Step 2: Tag the subscriber
      },
      {
        headers: {
          Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
        },
      }
    );

    // Step 3: Redirect to franchising class
    res.status(200).json({
      message: 'Successfully subscribed!',
      redirectUrl: 'https://oneclicklauncher.com/franchising-class',
    });
  } catch (error) {
    console.error(error.response?.data);
    res.status(500).json({ message: 'Subscription failed', error: error.response?.data });
  }
});
app.listen(port, () => console.log(`Server running on port ${port}`));
