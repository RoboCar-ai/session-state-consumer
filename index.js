/**
 * Triggered from a message on a Cloud Pub/Sub topic session.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const storage = require('@google-cloud/storage')();
const bucket = storage.bucket('sacred-reality-201417-mlengine');

exports.handler = async (event, context) => {
  const pubsubMessage = event.data;
  const content = JSON.parse(Buffer.from(pubsubMessage, 'base64').toString());
  console.log('received message:', content);
  
  const session = bucket.file('sessions/donkey.json');

  sessionData = JSON.parse((await session.download()).toString('utf8'));
  ++sessionData.count;

  // update status.
  if (content.command = 'start') sessionData.status = 'active';
  else sessionData.status = 'inactive';

  await session.save(JSON.stringify(sessionData));
  console.log('session updated to:', sessionData);
};
