RecipeCraft – Secure CRUD Application (INFR3120 Assignment 2)


Description:
RecipeCraft is a secure recipe management web application that allows users to create, view, update, and delete their own recipes.
In this version (Project Part 2), full user authentication, sessions, and protected routes were added.
Each user has a personal account, and recipes are stored per-user, so no other user can see or modify them.

The application uses Node.js, Express, Passport.js, MongoDB Atlas, EJS, and is deployed on Render.

Features (Updated for Part 2 Authentication)
User Authentication

Register page

Login page

Logout functionality

Password hashing with bcrypt

Session-based authentication using Passport.js

Navigation Bar Rules

Shows Login and Register when logged out

Shows Logout when logged in

Add Recipe is protected and redirects to login if needed

Protected CRUD

Create Recipe requires login

Edit Recipe requires login and must belong to the logged-in user

Delete Recipe requires login and must belong to the logged-in user

View Recipe requires login and must belong to the logged-in user

Per-User Recipes

Each user only sees their own recipes on the homepage

Logging into another account shows a different set of recipes

Public Pages

About page (public)

Contact page (public)

Technologies Used
Node.js
Express.js
Passport.js (Local Strategy)
MongoDB Atlas
Mongoose
EJS
HTML/CSS
Bootstrap
Render (Cloud Deployment)




File Structure
app.js               – Main server file
config/passport.js   – Passport authentication configuration
routes/auth.js       – Login, Register, Logout routes
routes/index.js      – Recipe CRUD and protected routes
models/User.js       – User schema
data/recipes.js      – Recipe schema with user ownership
views/               – All EJS pages
views/partials/      – Header and Footer templates
public/              – CSS, JS, images
.env                 – MongoDB URI and session secret
.gitignore           – Ignores node_modules and .env


Environment Variables
Create a .env file in the project root with:

MONGO_URI=your-mongodb-connection-string
SESSION_SECRET=anysecretstring


The .env file should not be pushed to GitHub.

How to Run Locally

Install Node.js

Run:
npm install


Create a .env file with your MongoDB connection string

Start the server:
npm start


Open the browser:
http://localhost:3000

Deployment (Render)
Your Render service must include these environment variables:
MONGO_URI=your Atlas URI
SESSION_SECRET=your secret


Start Command:
npm start
After deployment, users can register and log in on the live site.

Purpose:
This project was created for the INFR3120 Web & Script Programming course (Assignment Part 2).
The focus of this release is authentication, session management, protected CRUD operations, and cloud deployment.
