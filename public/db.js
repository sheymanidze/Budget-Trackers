let db;


//Budget database
const request = indexedDB.open("budgets", 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

//if app online
request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};