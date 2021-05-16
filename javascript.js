
let age;
let pincode;
function findSlot() {
  pincode = document.getElementsByClassName('pin')[0].value;
  age = document.getElementsByClassName('age')[0].value;
  getData();
}
let timoutCbk;
let dateInstance = new Date();
let fDate = `${dateInstance.getDate()}-${dateInstance.getMonth() + 1}-${dateInstance.getFullYear()}`
const getData = () => {
  fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${fDate}`)
    .then(response => response.json())
    .then(data => {//console.log('heree',data);

      let tbody = document.getElementById("tableBody").innerHTML;
      tbody = "";
      for (let val of data.centers) {
        for (let session of val.sessions) {
          let item = `<tr>
                <td>${val.name} , ${val.address}</td>
                <td>${session.min_age_limit}</td>
                <td>${session.available_capacity}</td>
           </tr>`
          tbody += item;
          if (session.min_age_limit >= age) {
            notifyMe(`slot available for age above and equal to ${age}`);
          }
        }

      }
      document.getElementById("tableBody").innerHTML = tbody;
      notifyMe();
    });
}


function notifyMe(msg = "Notification Enabled") {
  console.log('inside notification check', window.Notification.permission);
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  else if (Notification.permission === "granted") {
    var notification = new Notification(msg);
  }

  else if (Notification.permission !== "denied") {
    window.Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        var notification = new Notification(msg);
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}



timoutCbk = setInterval(() => {
  console.log('set timeout complete....');
  getData();
}, 3600000)