import { getAuth, signInWithEmailAndPassword } from "./firebase.js"; // Use correct Firebase path

// Initialize Firebase Authentication
const auth = getAuth();

// Function to handle admin login
async function adminLogin() {
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();

    // Ensure email and password fields are not empty
    if (!email || !password) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter both email and password.',
        });
        return;
    }

    try {
        // Show loader while processing login
        Swal.fire({
            title: 'Logging in...',
            text: 'Please wait a moment...',
            didOpen: () => {
                Swal.showLoading(); // Show loader
            }
        });

        // Sign in the admin using Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Extract authenticated user details
        const user = userCredential.user;
        console.log("Admin logged in successfully!", user);

        // Close the loader and show success message
        Swal.close();
        Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'You are now logged in as an admin.',
        });

        // Redirect to Admin Dashboard
        window.location.href = "adminDashboard.html";
    } catch (error) {
        console.error("Error during login:", error);

        // Close the loader and show error message
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.message,
        });
    }
}

// Event listener for login button
document.getElementById("loginButton").addEventListener("click", adminLogin);

document.getElementById("signupRedirectButton").addEventListener("click", function() {
    window.location.href = "adminSignup.html";  // Redirect to the role selection page
});
