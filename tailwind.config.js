/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./main.js",
    "./adminSignup.html",        // Root level par adminSignup.html
    "./adminLogin.html",         // Root level par adminLogin.html
    "./adminDashboard.html",     // Root level par adminDashboard.html
    "./userSignup.html",         // Root level par userSignup.html
    "./userLogin.html",          // Root level par userLogin.html
    "./userDashboard.html",      // Root level par userDashboard.html
    "./adminSignup.js",          // Root level par adminSignup.js
    "./adminLogin.js",           // Root level par adminLogin.js
    "./adminDashboard.js",       // Root level par adminDashboard.js
    "./userSignup.js",           // Root level par userSignup.js
    "./userLogin.js",            // Root level par userLogin.js
    "./userDashboard.js",        // Root level par userDashboard.js
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
