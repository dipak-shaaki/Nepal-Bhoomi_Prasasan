 Full Testing Guide for the Digital Land System (MERN Stack)
💤 You can test everything tomorrow! This guide contains detailed testing instructions for each feature.

🛠 Prerequisites Before Testing
Start your backend server
sh
Copy
Edit
npm start
Use Postman or cURL for API Requests
Ensure MongoDB is running
Replace YOUR_JWT_TOKEN with actual tokens after logging in.
✅ 1. User Authentication (Signup & Login)
📌 1️⃣ Register a New User
🔹 POST /api/auth/register
📌 Request Body:

json
Copy
Edit
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "user"
}
📌 Expected Response:

json
Copy
Edit
{
  "message": "User registered successfully. Please login to continue.",
  "user": {
    "_id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
📌 2️⃣ Login & Get JWT Token
🔹 POST /api/auth/login
📌 Request Body:

json
Copy
Edit
{
  "email": "john@example.com",
  "password": "Password123"
}
📌 Expected Response (Save Token for Next Steps):

json
Copy
Edit
{
  "message": "User logged in successfully",
  "token": "YOUR_JWT_TOKEN"
}
📌 3️⃣ Get User Profile
🔹 GET /api/auth/profile
📌 Headers:

json
Copy
Edit
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
📌 Expected Response:

json
Copy
Edit
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
✅ 2. Land Management
📌 4️⃣ Register a Land (Requires User Login)
🔹 POST /api/land/register
📌 Headers:

json
Copy
Edit
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
📌 Request Body:

json
Copy
Edit
{
  "location": {
    "province": "Bagmati",
    "district": "Kathmandu",
    "municipality": "Kathmandu Metropolitan City",
    "ward": "5"
  },
  "gps_coordinates": {
    "latitude": 27.7172,
    "longitude": 85.324
  },
  "area": {
    "value": 1,
    "unit": "ropani"
  },
  "landType": "Residential",
  "price": 10000000,
  "documents": "land-doc.pdf"
}
📌 Expected Response:

json
Copy
Edit
{
  "message": "Land registered successfully, pending approval",
  "land": {
    "owner": "USER_ID",
    "status": "Pending"
  }
}
📌 5️⃣ Approve Land (Requires Admin Login)
🔹 PUT /api/land/approve/LAND_ID
📌 Headers:

json
Copy
Edit
{
  "Authorization": "Bearer ADMIN_JWT_TOKEN"
}
📌 Expected Response:

json
Copy
Edit
{
  "message": "Land approved successfully",
  "land": {
    "status": "Approved"
  }
}
📌 6️⃣ Edit Land Details (Owner Only)
🔹 PUT /api/land/edit/LAND_ID
📌 Headers:

json
Copy
Edit
{
  "Authorization": "Bearer OWNER_JWT_TOKEN"
}
📌 Request Body (Only update required fields):

json
Copy
Edit
{
  "updates": {
    "price": 9500000
  }
}
📌 Expected Response:

json
Copy
Edit
{
  "message": "Land details updated successfully"
}
✅ 3. Selling & Buying Land
📌 7️⃣ List Land for Sale (Owner Only)
🔹 PUT /api/land/sell/LAND_ID
📌 Headers:

json
Copy
Edit
{
  "Authorization": "Bearer OWNER_JWT_TOKEN"
}
📌 Expected Response:

json
Copy
Edit
{
  "message": "Land listed for sale successfully",
  "land": {
    "status": "For Sale"
  }
}
📌 8️⃣ Buy Land (New Buyer)
🔹 PUT /api/land/buy/LAND_ID
📌 Headers:

json
Copy
Edit
{
  "Authorization": "Bearer BUYER_JWT_TOKEN"
}
📌 Expected Response (Ownership Transfers):

json
Copy
Edit
{
  "message": "Land purchased successfully!",
  "land": {
    "status": "Sold",
    "owner": "NEW_OWNER_ID"
  },
  "taxPaid": 50000,
  "finalAmountPaid": 1050000
}
✅ 4. Password Reset
📌 9️⃣ Forgot Password (Request Reset Email)
🔹 POST /api/auth/forgot-password
📌 Request Body:

json
Copy
Edit
{
  "email": "john@example.com"
}
📌 Expected Response:

json
Copy
Edit
{
  "message": "Password reset email sent"
}
✅ Check MongoDB (resetToken is stored in the user record).

sh
Copy
Edit
db.users.find({ email: "john@example.com" }).pretty()
📌 1️⃣0️⃣ Reset Password Using Token
🔹 PUT /api/auth/reset-password/TOKEN
📌 Request Body:

json
Copy
Edit
{
  "newPassword": "NewSecurePassword123"
}
📌 Expected Response:

json
Copy
Edit
{
  "message": "Password reset successfully"
}
✅ Login Again Using New Password

json
Copy
Edit
{
  "email": "john@example.com",
  "password": "NewSecurePassword123"
}
🛠 Final Debugging Checklist
✅ Make sure land ownership changes after purchase.
✅ Ensure old owner cannot buy back their own land.
✅ Verify balance updates correctly after transactions.
✅ Check tax deduction in buying process.
✅ Ensure users can reset passwords successfully.



Just commit