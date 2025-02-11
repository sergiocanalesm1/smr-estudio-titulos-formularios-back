const { Storage } = require('@google-cloud/storage')
const storage = new Storage();
const myBucket = storage.bucket(process.env.BUCKET_NAME);
const Busboy = require('busboy');

async function handleFormData(req) {
  const busboy = Busboy({headers: req.headers});
  const [exists] = await myBucket.exists();
  if (!exists) throw new Error('Bucket does not exist');

  const fields = {};

  // non-file fields in the form.
  busboy.on('field', (fieldname, val) => {
    fields[fieldname] = val;
  });

  const fileWrites = [];

  // upload file to gcp bucket
  busboy.on('file', (fieldname, file, { filename, mimeType }) => {
    if (fieldname !== 'documents') {
      console.warn('wrong fieldname');
      file.resume();
      return;
    }

    const destFileName = `${fields.caso_id}/${filename}`;
    const gcsFile = myBucket.file(destFileName);
    
    const writeStream = gcsFile.createWriteStream({
      metadata: { contentType: mimeType },
      resumable: false
    });

    const uploadPromise = new Promise((resolve, reject) => {
      writeStream
        .on('finish', resolve)
        .on('error', reject);
    });

    fileWrites.push(uploadPromise);
    file.pipe(writeStream);
  });

  busboy.on('finish', async () => {
    try {
      await Promise.all(fileWrites);

    } catch (error) {
      console.error('Final processing error:', error);
      // res.status(500).json({ error: error.message });
    }
  });

  busboy.end(req.rawBody);
  return fields;
}

module.exports = {handleFormData};