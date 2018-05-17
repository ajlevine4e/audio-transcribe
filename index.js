/**
 * Triggered from a message on a Cloud Storage bucket.
 *
 * @param {!Object} event The Cloud Functions event.
 * @param {!Function} The callback function.
 */
exports.analyzeRecording = (event) => {
  const object = event.data;

  if (object.resourceState === 'not_exists') {
    // Ignore file deletions
    return true;
  } 

  console.log(`Analyzing gs://${object.bucket}/${object.name}`);

  // Import the Google Cloud client libraries
  const speech = require('@google-cloud/speech').v1p1beta1;
  const storage = require('@google-cloud/storage')();
  
  const client = new speech.SpeechClient();

  
  const bucket = storage.bucket(DESTINATION BUCKET);
  //replace this with you're desired destination bucket
  const dir = require('path').parse(object.name).dir;
  
  /*--------Older version of config--------------
  var config = {
  sampleRateHertz: 44100,
  encoding: 'LINEAR16',
  languageCode: 'en-US'
  };
  ---------------------------------------------*/
  
    // Configure audio settings for video recordings -- BETA version
 
  const audioConfig = {
    sampleRateHertz: 44100,
    encoding: 'LINEAR16',
    languageCode: 'en-US',
    enableWordTimeOffsets: true,
    enableAutomaticPunctuation: true,
    model: 'video'
  };
  
  
  var uri = `gs://${object.bucket}/${object.name}`;
  var audio = {
    uri : uri
   };
  var request = {
    config: audioConfig,
    audio: audio
  };

  // Transcribe the audio file
   return client.recognize(request)
      .then(([transcription]) => {
 
     const filename = `${dir}/${object.name} -analysis.json`;
      console.log(`Saving gs://${object.bucket}/${filename}`);

      return bucket
        .file(filename)
        .save(JSON.stringify(transcription, null, 2));
    });
};
