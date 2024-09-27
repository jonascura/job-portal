import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  updateEmail,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

// assign user role (called within registration)
export const assignUserRole = async (email, role) => {
  try {
    //  call from job-portal-server/routes/adminRoutes.js
    const response = await fetch(
      "https://job-portal-back-4yxs.onrender.com/setUserRole",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, role }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to assign user role");
    }
    console.log(`Assigned role '${role}' to user: ${email}`);
  } catch (error) {
    console.error("Error assigning role to user:", error);
    throw error;
  }
};

export const logInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // check if the user has admin custom claim
    const idTokenResult = await userCredential.user.getIdTokenResult();

    const role = idTokenResult.claims.role;

    if (!idTokenResult.claims.admin) {
      if (role === 'employer') {
        console.log("Employer logged in successfully");
        // Handle admin-specific logic
      } else {
        console.log("Regular user logged in successfully");
        // Handle regular user logic
      }
    } else {
      console.log("Admin logged in successfully");
    }

    return { email: userCredential.user.email, role };
  } catch (error) {
    console.error("Error signing in:", error.message);
    // Handle sign-in errors
    throw error.message;
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////
// -------- candidate(user) logic --------------------------------------------------------------------- //
//////////////////////////////////////////////////////////////////////////////////////////////////
export const registerUserWithEmailAndPassword = async (
  firstName,
  lastName,
  email,
  password
) => {
  try {
    console.log("Received firstName:", firstName, "lastName:", lastName);

    // create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("Created user:", user);

    // update user profile with first name and last name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    console.log(
      "Updated profile with display name:",
      `${firstName} ${lastName}`
    );

    // Ensure the profile is updated in Firebase
    await new Promise((resolve) => {
      onAuthStateChanged(auth, (updatedUser) => {
        if (updatedUser && updatedUser.uid === user.uid) {
          console.log("Confirmed profile update for user:", updatedUser);
          resolve();
        }
      });
    });

    // register user to mongoDB
    await registerUserToMongo(firstName, lastName, email, user.uid);

    // assign user role
    await assignUserRole(email, "user");

    console.log("Registered user to MongoDB with UID:", user.uid);
    // send email verification
    // await sendEmailVerification(user);

    console.log("yo user is:", user);
    return user;
  } catch (error) {
    console.error("error in auth registerUserWithEmail... ", error);
    throw error;
  }
};

export const registerUserToMongo = async (firstName, lastName, email, uid) => {
  console.log("name is:", firstName); // check data
  try {
    console.log("Registering user to MongoDB:", {
      firstName,
      lastName,
      email,
      uid,
    });

    //  call from userRoutes.js
    const response = await fetch(
      "https://job-portal-back-4yxs.onrender.com/register",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          uid,
        }),
      }
    );

    if (response.ok) {
      console.log("User registered successfully!");
    } else {
      const errorText = await response.text();
      console.error("Failed to register user in MongoDB:", errorText);
    }
  } catch (error) {
    console.error("Error in registerUserToMongo:", error);
  }
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // make sure we have a displayName before proceeding
    if (!user.displayName) {
      throw new Error("Google sign-in returned a user without a display name");
    }

    const [firstName, ...lastNameParts] = user.displayName.split(" ");
    const lastName = lastNameParts.join(" ");

    // register to MongoDB (should move this call out of this function)
    await registerUserToMongo(firstName, lastName, user.email, user.uid);

    return result; // return the result or user as needed
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error; // throw to handle in the component
  }
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error; // Rethrow the error for handling in the calling component
  }
};

export const doPasswordChange = () => {
  return updatePassword(auth, email);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};

// doesn't work without verification email
export const updateUserEmail = async (newEmail) => {
  try {
    const user = auth.currentUser; // get the current authenticated user
    if (user) {
      // if (!user.emailVerified) {
      //   await sendEmailVerification(user);
      //   throw new Error("Please verify your email before changing it.");
      // }
      await updateEmail(user, newEmail);
      console.log("Email updated successfully");
    } else {
      throw new Error("No authenticated user found");
    }
  } catch (error) {
    console.error("Error updating email:", error.message);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////
// -------- employer logic --------------------------------------------------------------------- //
//////////////////////////////////////////////////////////////////////////////////////////////////
export const registerEmployerWithEmailAndPassword = async (
  companyName,
  email,
  password
) => {
  try {
    console.log("Received companyName:", companyName);

    // create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const employer = userCredential.user;

    console.log("Created employer:", employer);

    // update user profile with first name and last name
    await updateProfile(employer, {
      displayName: `${companyName}`,
    });

    console.log("Updated profile with display name:", `${companyName}`);

    // Ensure the profile is updated in Firebase
    await new Promise((resolve) => {
      onAuthStateChanged(auth, (updatedEmployer) => {
        if (updatedEmployer && updatedEmployer.uid === employer.uid) {
          console.log("Confirmed profile update for user:", updatedEmployer);
          resolve();
        }
      });
    });

    // assign user role
    await assignUserRole(email, "employer");
    await employer.getIdToken(true); // force token refresh

    // register employer to mongoDB
    await registerEmployerToMongo(companyName, email, employer.uid);

    console.log("Registered employer to MongoDB with UID:", employer.uid);
    // send email verification
    // await sendEmailVerification(user);

    console.log("yo employer is:", employer);
    return employer;
  } catch (error) {
    console.error("error in auth registerEmployerWithEmail... ", error);
    throw error;
  }
};

// employer reg
export const registerEmployerToMongo = async (companyName, email, uid) => {
  console.log("name is:", companyName);
  try {
    console.log("Registering user to MongoDB:", { companyName, email, uid });

    // call from employerRoutes.js
    const response = await fetch(
      "https://job-portal-back-4yxs.onrender.com/register-employer",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          email,
          uid,
        }),
      }
    );

    if (response.ok) {
      console.log("Employer registered successfully!");
    } else {
      const errorText = await response.text();
      console.error("Failed to register employer in MongoDB:", errorText);
    }
  } catch (error) {
    console.error("Error in registerEmployerToMongo:", error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////
// -------- admin logic --------------------------------------------------------------------- //
//////////////////////////////////////////////////////////////////////////////////////////////////
export const registerAdminToMongo = async (firstName, lastName, email, uid) => {
  console.log("name is:", firstName);
  try {
    console.log("Registering admin to MongoDB:", {
      firstName,
      lastName,
      email,
      uid,
    });

    const response = await fetch(
      "https://job-portal-back-4yxs.onrender.com/register-admin",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          uid,
        }),
      }
    );

    if (response.ok) {
      console.log("Admin registered successfully!");
    } else {
      const errorText = await response.text();
      console.error("Failed to register admin in MongoDB:", errorText);
    }
  } catch (error) {
    console.error("Error in registerAdminToMongo:", error);
  }
};
