import { db, collection, doc, getDoc, getAuth, createUserWithEmailAndPassword, setDoc, serverTimestamp } from "./firebase.js";

// Initialize Firebase Authentication
const auth = getAuth();
const cloudName = "dukmizgzg";
const unSignedUploadPreSet = "esqdfaa1";
const profilePicInput = document.getElementById("fileUpload");

// Function to check if the entered email exists in the "admin" collection in Firestore
async function checkAdminEmail(email) {
    const adminDocRef = doc(db, "admin", email); // Use email as the document ID

    try {
        const adminDoc = await getDoc(adminDocRef);

        if (adminDoc.exists()) {
            // If the email matches an admin email, proceed to authentication
            console.log("Admin email found, proceeding to authentication");
            authenticateAdmin(email);
        } else {
            // If the email does not match, show the error popup
            showErrorPopup("You have selected the wrong role. Please go back and select the correct one.");
        }
    } catch (error) {
        console.error("Error checking admin email:", error);
        showErrorPopup("Error while checking admin email. Please try again.");
    }
}

// Function to authenticate the admin using Firebase Authentication
async function authenticateAdmin(email) {
    const enteredPassword = document.getElementById("passwordInput").value; // Get the entered password
    const fullName = document.getElementById("fullNameInput").value; // Get the entered full name
    const phone = document.getElementById("phoneInput").value; // Get the entered phone number
    const address = document.getElementById("addressInput").value; // Get the entered address
    const file = profilePicInput?.files[0]; // Get the profile picture file, if any

    let imageUrl = ""; // Default image URL
    if (file) {
        try {
            const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", unSignedUploadPreSet);

            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            imageUrl = data.secure_url; // Uploaded image URL
        } catch (error) {
            console.error("Error uploading image:", error);
            Swal.fire("Error", "Failed to upload the profile picture.", "error");
            return;
        }
    }

    Swal.fire({
        title: "Please wait...",
        text: "Processing your request",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading(); // Show loading spinner
        },
    });

    try {
        // Firebase Authentication: create a new user with email and password
        await createUserWithEmailAndPassword(auth, email, enteredPassword);

        // Firestore: Add additional user details to Firestore under the admin collection
        const adminDocRef = doc(db, "admin", email);
        const userDetails = {
            fullName,
            email,
            phone,
            address,
            profilePic: imageUrl || null,
            createdAt: serverTimestamp(),
        };

        await setDoc(adminDocRef, userDetails);

        Swal.fire({
            icon: "success",
            title: "Admin Created!",
            text: "Redirecting to Admin Login...",
            showConfirmButton: false,
            timer: 2000,
        }).then(() => {
            window.location.href = "adminLogin.html"; // Redirect to login page
        });
    } catch (error) {
        console.error("Error creating user:", error);
        Swal.fire("Error", `Error during signup: ${error.message}`, "error");
    }
}

// Function to show the error popup with a message
function showErrorPopup(message) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
    });
}

// Wait for the DOM to load before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signupButton").addEventListener("click", function () {
        const enteredEmail = document.getElementById("emailInput").value;

        if (!enteredEmail) {
            Swal.fire("Warning!", "Please enter your email.", "warning");
            return;
        }

        checkAdminEmail(enteredEmail);
    });

    document.getElementById("goBackButton").addEventListener("click", function () {
        window.location.href = "index.html"; // Redirect to the role selection page
    });

    document.getElementById("loginRedirectButton").addEventListener("click", function () {
        window.location.href = "adminLogin.html"; // Redirect to the login page
    });
});
