/** ---- Envoie form User Update ---- */
const formLogin = document.getElementById('user-login');
const btnLogin = document.getElementById('login');
if (btnLogin) {
  btnLogin.addEventListener('click', login, false);
}
function login(event) {
  event.preventDefault();
  const formData = new FormData(formLogin);
  const data = {};
  formData.forEach((value, key) => (data[key] = value));
  // Lance la requête
  fetch(`/userLogin`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
    .then((response) => {
      console.log(response);
      if (response.status === 401) {
        //TODO dire ce qui va pas sur le form
      } else {
        response.json().then((result) => {
          window.location.replace(result);
        });
      }
    })
    .catch((error) => {
      alert('Erreur : ' + error.message);
    });
}
