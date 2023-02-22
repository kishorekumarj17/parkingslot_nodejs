**To install this project**

1. Create Firebase project and configure the firestore
2. Get Service account key from firebase
3. Give npm install and npm start to run the project

**API Endpoints:**

  1. POST  /newparkinglot  -  To create new parking space

  Example input -

  {
  "slots":50,
  "slotsSize":{"s":14,"l":12,"m":12,"xl":12},
  "parkingFloors":3,
  "floorSize":{
      "0":{"s":5,"l":5,"m":5,"xl":5},
      "1":{"s":4,"l":2,"m":2,"xl":2},
      "2":{"s":5,"l":5,"m":5,"xl":5}
  }
  }
  
  2. GET /getslot/<Parkinglot ID>/<Size>  - To get a slot in parking space
  
  3. GET /releaseslot/<Parkinglot ID>/<slot id> - To release a slot in parking space
  
**Firestore transactions:**
  
  Firestore transactions are used to lock the document when a slot is getting released and filled to ensure same slot are not allocated twice
  
  NoSQl Firestore database peforms CRUD operation and release the locks in documents once read-write operations are performed

  
