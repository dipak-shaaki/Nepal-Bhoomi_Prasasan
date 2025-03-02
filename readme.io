
user demo

Testing Steps
1️⃣ Register a User (Default: Buyer)
2️⃣ Login & Get Token
3️⃣ Test Role-Specific Access (Only Admin/Govt Can Approve Land)
4️⃣ Switch Role (Buyer ↔ Seller)
5️⃣ Test Land Registration & Role-Based Permissions

📌 1. Register a User
👉 Endpoint: POST /api/auth/register
👉 Expected: User registered with role buyer (default).

📤 Request (Register)
json
Copy code
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
📥 Response
json
Copy code
{
  "message": "User registered successfully",
  "user": {
    "id": "65a2b7c6d2e7f3a4b5c6d7e8",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
📌 2. Login & Get Token
👉 Endpoint: POST /api/auth/login
👉 Expected: JWT token returned for authentication.

📤 Request (Login)
json
Copy code
{
  "email": "john@example.com",
  "password": "securepassword"
}
📥 Response
json
Copy code
{
  "message": "User logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
🔹 Save the token for authorization in further tests.

📌 3. Test Role-Based Access (Approve Land - Only Govt/Admin)
👉 Endpoint: PUT /api/land/approve/:id
👉 Expected: Unauthorized access for normal users.

📤 Request (With User Token)
json
Copy code
{
  "headers": { "Authorization": "Bearer <user-token>" }
}
📥 Response (Unauthorized)
json
Copy code
{
  "message": "Access Denied: Unauthorized Role"
}
✅ Passed: Normal users cannot approve land.

📌 4. Switch Role (Buyer ↔ Seller)
👉 Endpoint: PUT /api/auth/switch-role
👉 Expected: Role switched between buyer & seller.

📤 Request
json
Copy code
{
  "headers": { "Authorization": "Bearer <user-token>" }
}
📥 Response
json
Copy code
{
  "message": "Role switched to seller",
  "role": "seller"
}
🔄 Test Again: Switching back to buyer.

📤 Request
json
Copy code
{
  "headers": { "Authorization": "Bearer <user-token>" }
}
📥 Response
json
Copy code
{
  "message": "Role switched to buyer",
  "role": "buyer"
}
✅ Passed: Users can switch between buyer and seller roles.

📌 5. Test Land Registration & Role-Based Permissions
👉 Endpoint: POST /api/land/register
👉 Expected: Only logged-in users can register land.

📤 Request
json
Copy code
{
  "headers": { "Authorization": "Bearer <user-token>" },
  "body": {
    "location": "Kathmandu",
    "coordinates": { "latitude": 27.7172, "longitude": 85.3240 },
    "area": { "value": 1, "unit": "ropani" },
    "landType": "Residential",
    "price": 10000000,
    "documents": "land-doc.pdf"
  }
}
📥 Response
json
Copy code
{
  "message": "Land registered successfully, pending approval",
  "land": {
    "id": "65a2b7c6d2e7f3a4b5c6d7e9",
    "owner": "65a2b7c6d2e7f3a4b5c6d7e8",
    "location": "Kathmandu",
    "coordinates": { "latitude": 27.7172, "longitude": 85.3240 },
    "area": { "value": 1, "unit": "ropani", "converted": 508.72 },
    "landType": "Residential",
    "price": 10000000,
    "documents": "land-doc.pdf",
    "status": "Pending"
  }
}
✅ Passed: Only logged-in users can register land.

🎯 Next Steps
🏡 Now we can move to Land Transactions!
Shall we proceed? 🚀



land demo
{
  "location": {
    "province": "Bagmati",
    "district": "Kathmandu",
    "municipality": "Kathmandu Metropolitan City",
    "ward": "5"
  },
  "gps_coordinates": {
    "latitude": 27.7172,
    "longitude": 85.3240
  },
  "area": {
    "value": 1,
    "unit": "ropani"
  },
  "landType": "Residential",
  "price": 10000000,
  "documents": "land-doc.pdf"
}


demo tests
register and login

{
  "name": "Ram Bahadur",
  "email": "ram@example.com",
  "password": "Ram@123",
  "role": "user"
}



token :"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzNkZjc5MDQxZDA0MzBhNzIyZmY5MiIsInJvbGUiOiJidXllciIsImlhdCI6MTc0MDg5MzY3NSwiZXhwIjoxNzQzNDg1Njc1fQ.bumajb8RKpNiHRL1-lAyPpNRO0VSS2uuwBbmzyQC8rY"



"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzNkZjc5MDQxZDA0MzBhNzIyZmY5MiIsInJvbGUiOiJidXllciIsImlhdCI6MTc0MDg5MzgwMSwiZXhwIjoxNzQzNDg1ODAxfQ.Fq3LBJEr72mmgiQK5pRjULt5Bxn3DdiiwjI4rlI2so0"



user registering land

{
    "message": "Land registered successfully, pending approval",
    "land": {
        "owner": "67c3df79041d0430a722ff92",
        "area": {
            "value": 1,
            "unit": "ropani",
            "converted": 508.72
        },
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
        "documents": "land-doc.pdf",
        "status": "Pending",
        "isForSale": false,
        "price": 10000000,
        "buyer": null,
        "transactionStatus": "Available",
        "_id": "67c3f865041d0430a722ffac",
        "createdAt": "2025-03-02T06:19:17.157Z",
        "updatedAt": "2025-03-02T06:19:17.157Z",
        "__v": 0
    }
}