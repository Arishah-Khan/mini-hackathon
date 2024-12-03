import { db, collection, doc, setDoc, getDoc } from "./firebase.js";

// Static admin email
const staticAdminEmail = "admin@example.com";

// Function to store admin email and role in Firestore under the "admin" collection
async function storeEmailInFirestore(email, role) {
    // Reference to the appropriate collection (admin or user)
    const collectionRef = collection(db, role === "admin" ? "admin" : "users");

    try {
        // Show a loader with SweetAlert while processing the request
        Swal.fire({
            title: 'Saving...',
            text: 'Please wait while we process your request.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();  // Show the loader
            }
        });

        // Reference to the document where email will be stored
        const userDocRef = doc(collectionRef, email); // Using email as the document ID

        // Check if the document already exists
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            // If the document doesn't exist, set the email and role in Firestore
            await setDoc(userDocRef, {
                email: email,
                role: role,  // Store role as "admin" or "user"
            });
            console.log(`${role} email saved in Firestore`);
        } else {
            console.log(`${role} email already exists`);
        }

        // Close the SweetAlert loader after the operation is complete
        Swal.close();

        // After storing email, redirect to the appropriate signup page
        if (role === "admin") {
            window.location.href = `adminSignup.html?email=${encodeURIComponent(email)}`;  // Redirect to admin signup
        } else {
            window.location.href = `userSignup.html?role=${encodeURIComponent(role)}`;  // Redirect to user signup
        }

    } catch (error) {
        // Close the SweetAlert loader in case of error
        Swal.close();

        // Show an error message using SweetAlert
        console.error("Error saving email:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong while saving your email. Please try again.',
        });
    }
}

// Trigger when the submit button is clicked
document.getElementById("roleSelectionButton").addEventListener("click", function() {
    const role = document.querySelector('input[name="role"]:checked');  // Get the selected role (admin or user)

    if (role) {
        if (role.value === "admin") {
            // If admin role is selected, store the static admin email
            storeEmailInFirestore(staticAdminEmail, "admin");  // Store static admin email and role
        } else {
            // If user role is selected, redirect to userSignup.html where email will be collected
            window.location.href = `userSignup.html?role=${encodeURIComponent(role.value)}`;
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Role Selection',
            text: 'Please select a role before proceeding.',
        });
    }
});
