const functions = require('@google-cloud/functions-framework');
const handleFormData = require('./utils/storage').handleFormData;
const validateFields = require('./utils/fields').validateFields;
const sendEmail = require('./utils/emails').sendEmail;
const generateClientFormUrl = require('./utils/fields').generateClientFormUrl;

functions.http('uploadFile', async(req, res) => {
  if (req.method !== 'POST') {
    // Return a "method not allowed" error
    return res.status(405).end();
  }

  const fields = await handleFormData(req);
  validateFields(fields);

  const clientFormUrl = generateClientFormUrl(fields);

  await sendEmail(clientFormUrl, fields);

  res.status(200).json({success: true});

});