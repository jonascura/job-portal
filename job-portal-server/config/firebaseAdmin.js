const admin = require("firebase-admin");

// require firebase service account object key
const serviceAccount = require("../firebaseServiceAccountKey.json");

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
