user logs in

{
  "name": "Ram Bahadur",
  "email": "ram@example.com",
  "password": "Ram@123",
  "role": "user"
}


registers land

{
  "location": {
    "province": "Lumbini",
    "district": "Rupandehi",
    "municipality": "Butwal Sub-Metropolitan City",
    "ward": "15"
  },
  "gps_coordinates": {
    "latitude": 28.6933,
    "longitude": 84.4444
  },
  "area": {
    "value": 5,
    "unit": "bigha"
  },
  "landType": "Agricultural",
  "price": 50000,
  "documents": "agricultural-doc.pdf"
}


And got output:

{
    "message": "Land registered successfully, pending approval",
    "land": {
        "owner": "67c3df79041d0430a722ff92",
        "area": {
            "value": 5,
            "unit": "bigha",
            "converted": 33863.15
        },
        "location": {
            "province": "Lumbini",
            "district": "Rupandehi",
            "municipality": "Butwal Sub-Metropolitan City",
            "ward": "15"
        },
        "gps_coordinates": {
            "latitude": 28.6933,
            "longitude": 84.4444
        },
        "documents": "agricultural-doc.pdf",
        "status": "Pending",
        "price": 50000,
        "isForSale": false,
        "buyer": null,
        "transactionStatus": "Available",
        "_id": "67c65b2a53156574b190bd78",
        "createdAt": "2025-03-04T01:45:14.906Z",
        "updatedAt": "2025-03-04T01:45:14.906Z",
        "__v": 0
    }
}



Request land edit


body
{
  "updates": {
    "price": 2500000,
    "location": {
      "district": "Lalitpur",
      "municipality": "Patan"
    },
    "gps_coordinates": {
      "latitude": 27.6721,
      "longitude": 85.3254
    }
  }
}
