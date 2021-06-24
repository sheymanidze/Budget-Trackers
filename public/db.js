let db;

//Budget database creating/openning
const request = indexedDB.open("budget", 1);

//run when database is upgrated
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

//if app online
request.onsuccess = function (event) {
  console.log(request.result)
  console.log(event)
  console.log(request)
  db = event.target.result;
  if (navigator.onLine) {
    //checkDatabase();
  }
};


//error
request.onerror = function (e) {
  console.log(`Woops! ${e.target.errorCode}`);
};

function saveRecord(record) {
  //transaction with readwrite access
  const transaction = db.transaction(["pending"], "readwrite");

  //pending object store
  const store = transaction.objectStore("pending");

  // add record
  store.add(record);
}