let db;

//Budget database creating/openning
const request = indexedDB.open("budget", 1);

//run when database is upgrated
request.onupgradeneeded = (event) => {
  db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

function checkDatabase() {
  let transaction = db.transaction(['pending'], 'readwrite');

  const store = transaction.objectStore('pending');
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.length !== 0) {
            const currentStore = transaction.objectStore('pending');

            currentStore.clear();


          }

        });

    }
  };

}

//if app online
request.onsuccess = function (event) {
  console.log(request.result)
  console.log(event)
  console.log(request)
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
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

//listen when back online
window.addEventListener('online', checkDatabase);