/**
 * Triggered from a message on a Cloud Pub/Sub topic session.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const storage = require('@google-cloud/storage')();
const bucket = storage.bucket('sacred-reality-201417-mlengine');

exports.handler = (event, context) => {
  const pubsubMessage = event.data;
  const content = JSON.parse(Buffer.from(pubsubMessage, 'base64').toString());
  console.log('received message:', content);
  
  const session = bucket.file('session/donkey.json');

  session.download().then(data => {
    const sessionData = JSON.parse(data.toString('utf8'));
    ++sessionData.count;
    sessionData.status = 'active';
    return session.save(sessionData);
  }).then(() => console.log('updated session'));
};
