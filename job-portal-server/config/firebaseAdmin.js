const admin = require("firebase-admin");

// require firebase service account object key
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// set admin custom claim
const setAdminCustomClaims = async (emails) => {
  try {
    const userRecords = await admin.auth().getUsers(emails.map(email => ({ email })));
    const promises = userRecords.users.map(user => {
      if (!user.customClaims || !user.customClaims.admin) {
        return admin.auth().setCustomUserClaims(user.uid, { admin: true });
      }
    });
    await Promise.all(promises);
    console.log(`Admin claims set successfully for users: ${emails}`);
  } catch (error) {
    console.error('Error setting admin claims:', error);
  }
};

// set role claims
const setRoleCustomClaims = async (email, role) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role });
    console.log(`Role set successfully for user: ${email}, Role: ${role}`);
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
};

module.exports = { admin, setAdminCustomClaims, setRoleCustomClaims };
