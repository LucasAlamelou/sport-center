var sidebar = document.querySelector('.sidebar');
var sidebarToggles = document.querySelectorAll(
  '#sidebarToggle, #sidebarToggleTop'
);

if (sidebar) {
  var collapseEl = sidebar.querySelector('.collapse');
  var collapseElementList = [].slice.call(
    document.querySelectorAll('.sidebar .collapse')
  );
  var sidebarCollapseList = collapseElementList.map(function (collapseEl) {
    return new bootstrap.Collapse(collapseEl, { toggle: false });
  });

  for (var toggle of sidebarToggles) {
    // Toggle the side navigation
    toggle.addEventListener('click', function (e) {
      document.body.classList.toggle('sidebar-toggled');
      sidebar.classList.toggle('toggled');

      if (sidebar.classList.contains('toggled')) {
        for (var bsCollapse of sidebarCollapseList) {
          bsCollapse.hide();
        }
      }
    });
  }
  var vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  if (vw < 768) {
    document.body.classList.toggle('sidebar-toggled');
    sidebar.classList.toggle('toggled');
  }
  // Close any open menu accordions when window is resized below 768px
  window.addEventListener('resize', function () {
    if (vw < 768) {
      for (var bsCollapse of sidebarCollapseList) {
        bsCollapse.hide();
      }
    }
  });
}

// Prevent the content wrapper from scrolling when the fixed side navigation hovered over

var fixedNaigation = document.querySelector('body.fixed-nav .sidebar');

if (fixedNaigation) {
  fixedNaigation.on('mousewheel DOMMouseScroll wheel', function (e) {
    var vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    if (vw > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });
}

var scrollToTop = document.querySelector('.scroll-to-top');

if (scrollToTop) {
  // Scroll to top button appear
  window.addEventListener('scroll', function () {
    var scrollDistance = window.pageYOffset;

    //check if user is scrolling up
    if (scrollDistance > 100) {
      scrollToTop.style.display = 'block';
    } else {
      scrollToTop.style.display = 'none';
    }
  });
}

const selectUser = document.getElementById('userCreate');
const optionCustomer = document.getElementById('optionCustomer');
const optionCoach = document.getElementById('optionCoach');

function optionCustomerOnChange() {
  console.log('Customer: ' + optionCustomer.checked);
  selectUser.action = '/customerCreate';
}

function optionCoachOnChange() {
  console.log('Coach: ' + optionCoach.checked);
  selectUser.action = '/coachCreate';
}

const userForm = document.getElementById('userCreate');
const feedBack = document.getElementById('feed-back');

function lanceRecherche(event) {
  const username = document.getElementById('username-register');
  // Récupère les données du formulaire
  const saisie = username.value;
  const data = { username: username.value };

  // Lance la recherche
  fetch('/username', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      //'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((data) => {
      data.json().then((result) => {
        console.log(result);
        if (result === 'false') {
          username.classList.remove('is-valid');
          username.classList.add('is-invalid');

          feedBack.classList.remove('valid-feedback');
          feedBack.classList.add('invalid-feedback');
          feedBack.innerHTML = 'Username déjà pris !';
        } else {
          username.classList.remove('is-invalid');
          username.classList.add('is-valid');

          feedBack.classList.remove('invalid-feedback');
          feedBack.classList.add('valid-feedback');
          feedBack.innerHTML = 'Username valide';
        }
      });
    })
    .catch((error) => {
      console.error('Erreur : ' + error.message);
    });
}

/** ---- Gestion repeat password ---- */

const password = document.getElementById('password');
const repeatPassword = document.getElementById('repeat_password');
const feedBackPassword = document.getElementById('feed-back-password');
if (repeatPassword) {
  repeatPassword.addEventListener('change', verifyPassword, false);
}

function verifyPassword(event) {
  if (password.value !== repeatPassword.value) {
    repeatPassword.classList.remove('is-valid');
    repeatPassword.classList.add('is-invalid');
    feedBackPassword.classList.remove('invalid-feedback');
    feedBackPassword.classList.add('valid-feedback');
    feedBackPassword.innerHTML = 'Mot de passe non indentique';
  } else {
    repeatPassword.classList.remove('is-invalid');
    repeatPassword.classList.add('is-valid');
    feedBackPassword.classList.remove('invalid-feedback');
    feedBackPassword.classList.add('valid-feedback');
    feedBackPassword.innerHTML = 'Mot de passe indentique';
  }
}

const User = {
  user: 'User',
  customer: 'Customer',
  coach: 'Coach',
};

/** ---- Envoie form User Delete ---- */
const formUserDelete = document.getElementById('userDelete');
const userDeleteButton = document.getElementById('userDeleteButton');
if (userDeleteButton) {
  userDeleteButton.addEventListener('click', userDelete, false);
}
function userDelete(e) {
  // Ne soumet pas le formulaire
  e.preventDefault();
  // Récupère les données du formulaire
  const formData = new FormData(formUserDelete);
  const data = {};
  formData.forEach((value, key) => (data[key] = value));
  const messageAlert = `Vous êtes sur vouloir supprimer l'utilisateur ${User.user}?`;
  alert(messageAlert);
  // Lance la requête
  fetch(`${User.user.toLowerCase()}Delete`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      alert('Erreur : ' + error.message);
    });
}

/** ---- Envoie form Customer Delete ---- */
const formCustomerDelete = document.getElementById('customerDelete');
const customerDeleteButton = document.getElementById('customerDeleteButton');
if (customerDeleteButton) {
  customerDeleteButton.addEventListener('click', customerDelete, false);
}
function customerDelete(event) {
  // Ne soumet pas le formulaire
  event.preventDefault();
  // Récupère les données du formulaire
  const formData = new FormData(formCustomerDelete);
  const data = {};
  formData.forEach((value, key) => (data[key] = value));
  const messageAlert = `Vous êtes sur vouloir supprimé l'utilisateur ${User.customer}?`;
  alert(messageAlert);
  // Lance la requête
  fetch(`${User.customer.toLowerCase()}Delete`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      alert('Erreur : ' + error.message);
    });
}

/** ---- Envoie form Coach Delete ---- */
const formCoachDelete = document.getElementById('coachDelete');
const coachDeleteButton = document.getElementById('coachDeleteButton');
if (coachDeleteButton) {
  coachDeleteButton.addEventListener('click', coachDelete, false);
}

function coachDelete(event) {
  // Ne soumet pas le formulaire
  event.preventDefault();
  // Récupère les données du formulaire
  const formData = new FormData(formCoachDelete);
  const data = {};
  formData.forEach((value, key) => (data[key] = value));
  const messageAlert = `Vous êtes sur vouloir supprimé l'utilisateur ${User.coach}?`;
  alert(messageAlert);
  // Lance la requête
  fetch(`${User.coach.toLowerCase()}Delete`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      alert('Erreur : ' + error.message);
    });
}

/** ---- Envoie form User Update ---- */
const formUserUpdate = document.getElementById('user-update');
const buttonFormUserUpdate = document.getElementById('btn-user-update');
if (buttonFormUserUpdate) {
  buttonFormUserUpdate.addEventListener('click', userUpdate, false);
}
function userUpdate(event) {
  event.preventDefault();
  const formData = new FormData(formUserUpdate);
  const data = {};
  formData.forEach((value, key) => (data[key] = value));
  console.log(data);
  // Lance la requête
  fetch(`/userUpdate`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
    .then((response) => {
      response.json().then((result) => {
        console.log(result.firstName);
      });
    })
    .catch((error) => {
      alert('Erreur : ' + error.message);
    });
}
