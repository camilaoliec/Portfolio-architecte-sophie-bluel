// Variable goblal
const addPhotoTitle = document.querySelector("#addPhotoTitle");
const galerietitle = document.querySelector("#galleryTitle");
const modalAll = document.querySelector(".modal");
const modalBtnAddPhoto = document.querySelector(".modal-btn-add-photo");
const modalGalleryView = document.querySelector(".modal-gallery-view");
const modalGallery = document.querySelector("#modal-gallery");
const addPhotoModal = document.querySelector("#modal-add-photo"); // Parent modal
const addPhotoView = document.querySelector(".modal-add-photo-view");
const backToGallery = document.querySelector(".back-to-gallery");
const jsModal = document.querySelector(".js-modal");
const loged = window.localStorage.getItem("token") || false;

// Fonction pour ajouter les projets à la galerie
function addWorksToGallery(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Efface la galerie

  works.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  });
}

// Fonction pour generer dynamiquement le menu de categories
function generateCategoryMenu(works) {
  const categories = new Set();
  categories.add("Tous"); // Ajoute l'option "Tous"

  // Extraire les categories de projets
  works.forEach((work) => {
    if (work.category && work.category.name) {
      categories.add(work.category.name);
    }
  });

  const menu = document.querySelector(".category-menu"); // Ajoute l'élement de menu de categorie
  menu.innerHTML = "";

  // Creer un bouton pour chaque categorie
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category;
    button.classList.add("category-button"); // Ajoute une classe CSS
    button.addEventListener("click", () =>
      filterWorksByCategory(category, works)
    );
    menu.appendChild(button);
  });
}

// Function pour filtrer par categorie
function filterWorksByCategory(category, works) {
  if (category === "Tous") {
    addWorksToGallery(works);
  } else {
    const filteredWorks = works.filter(
      (work) => work.category.name === category
    );
    addWorksToGallery(filteredWorks);
  }
}

// L’appel à l’API avec fetch
let worksData = [];
async function getWorks() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    worksData = await response.json();
    console.log(worksData); // Vérifie les données reçues
    addWorksToGallery(worksData); // Appelle la fonction pour ajouter des projets à la galerie.
    generateCategoryMenu(worksData); // Appelle la fonction pour générer le menu categories
  } catch (error) {
    console.error(error.message);
  }
}

getWorks(); // Appelle à la fonction

// Formulaire - contact
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Capturer les données du formulaire
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    console.log(`Nom: ${name}, Email: ${email}, Message: ${message}`);
  });

// Modal
let modal = null;

const openModal = function (e) {
  e.preventDefault();

  const targetElement = e.target.closest('a');

  if (!targetElement) return;

  const target = document.querySelector(targetElement.getAttribute("href"));

  if (!target) return;

  if (modal) closeModal();

  modal = target;

  console.log("ouvrir modal", modal.id)

  modal.style.display = "flex";
  modal.classList.add("is-visible");
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");

  if (modal.id === 'modal-gallery') {
    addWorksToModal(worksData);
    modalGalleryView.style.display = "flex"
  }

  const closeButtons = modal.querySelectorAll(".js-modal-close");
  closeButtons.forEach(button => {
    if (!button.dataset.listenerAdded) {
      console.log("Ajoute click au buton x", button);
      button.addEventListener("click", closeModal);
      button.dataset.listenerAdded = "true";
    }
  });

  modal.addEventListener("click", closeModalOnOutsideClick);
};

const closeModal = function (e) {
  if (e) {
    e.preventDefault(); 
  }

  if (modal === null) return;

  console.log("Fermeture du modal", modal.id);

  modal.classList.remove("is-visible");
  modal.removeAttribute("aria-modal");
  modal.setAttribute('aria-hidden', 'true');

  if (modal.id === 'modal-add-photo') {
    addPhotoView.style.display = "none";
    addPhotoModal.style.display = "none";
  } else if (modal.id === 'modal-gallery') {
    modalGalleryView.style.display = "none";
    modalGallery.style.display = "none";
  }

  const openModalButton = document.querySelector('.js-modal');
  if (openModalButton && !modal.hasAttribute ('aria-hidden')) {
      openModalButton.focus();
  }

  document.querySelectorAll(".modal").forEach(modalElement => {
    modalElement.classList.remove("is-visible");
    modalElement.style.display = "none";
  });

  modal.removeEventListener("click", closeModalOnOutsideClick);
  modal = null
};

const closeButtons = document.querySelectorAll(".js-modal-close");
closeButtons.forEach(button => {
  button.addEventListener('click', (e) => { 
      console.log("Bouton de fermeture cliqué");
      closeModal(e);
  });
});

const closeModalOnOutsideClick = function (e) {
  if (e.target === modal || e.target.classList.contains('modal')) {
    if (modal.id === 'modal-add-photo') {
      addPhotoView.classList.remove("is-visible");
      addPhotoModal.classList.remove("is-visible")
      addPhotoModal.style.display = "none";
    } else if (modal.id === 'modal-gallery') {
      modalGalleryView.classList.remove("is-visible");
      modalGallery.classList.remove("is-visible");
      modalGallery.style.display = "none";
    }
    closeModal(e);
  }
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

function addWorksToModal(works) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.classList.add("modal-figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    figure.appendChild(img);

    // Icône poubelle
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");
    trashIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteWork(work.id, figure);
    });

    figure.appendChild(trashIcon);
    modalGallery.appendChild(figure);
  });
}

// Suppression de travaux existants
function deleteWork(workId, figureElement) {
  const isConfirmed = confirm("Voulez-vous vraimment supprimer ce travail?");
  if (!isConfirmed) {
    return;
  }
  const token = localStorage.getItem("token");
  const url = `http://localhost:5678/api/works/${workId}`;

  fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        figureElement.remove();
        console.log(`Work with ID ${workId} was deleted.`);
      } else {
        console.error(`Failed to delete work with ID ${workId}`);
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Gestion de l'événement du clic sur "Ajouter une photo"
// Fonction pour basculer entre les modales

// Sélection des éléments des modales

// Fonction pour basculer entre les modales
function toggleModals() {
  // Vérifier si les éléments existent
  if (
    !modalBtnAddPhoto ||
    !modalGalleryView ||
    !addPhotoModal ||
    !addPhotoView ||
    !backToGallery
  ) {
    console.error("Un ou plusieurs éléments DOM ne sont pas trouvés");
    return;
  }

  // Gestion de l'événement du clic sur "Ajouter une photo"
  modalBtnAddPhoto.addEventListener("click", function () {
    console.log("Bouton Ajouter une photo cliqué");

    // Masquer la galerie et afficher la modale d'ajout de photo
    modalGalleryView.classList.remove("is-visible");
    modalGallery.classList.remove("is-visible");
    addPhotoModal.style.display = "flex";
    addPhotoView.style.display = "flex";
    addPhotoModal.classList.add("is-visible");
    addPhotoView.classList.add("is-visible");
  });

  // Gestion du retour à la galerie
  backToGallery.addEventListener("click", function () {
    console.log("Bouton Retour à la galerie cliqué");

    // Masquer la vue ajout de photo et afficher la galerie
    addPhotoView.classList.remove("is-visible");
    addPhotoModal.classList.remove("is-visible");
    addPhotoModal.style.display = "none";
    modalGalleryView.classList.add("is-visible");
    modalGallery.classList.add("is-visible");
  });

  addPhotoModal.addEventListener("click", function (e) {
    if (e.target === addPhotoModal || e.target.classList.contains ("js-modal-close")) {
      addPhotoView.classList.remove("is-visible");
      addPhotoModal.classList.remove("is-visible");
      addPhotoModal.style.display = "none";
    }
  });

  modalGallery.addEventListener("click", function (e) {
    if (e.target === modalGallery || e.target.classList.contains("js-modal-close")) {
      modalGalleryView.classList.remove("is-visible");
      modalGallery.classList.remove("is-visible");
      modalGallery.style.display = "none";
    }
  });
}

// Appel de la fonction pour initialiser les événements
toggleModals();

// Gestion du formulaire de soumission
document
  .getElementById("add-photo-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    console.log(localStorage.getItem("token"));

    if (!localStorage.getItem("token")) {
      console.error("Token non trouvé, utilisateur non connecté.");
      return;
    }

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success: data", data);
        addNewWorkToGallery(data);
        
        modalGalleryView.classList.add("is-visible");
        addPhotoView.style.display = "none";
        addPhotoTitle.textContent = "Galerie photo";
        addPhotoModal.classList.remove("is-visible");

        modalGallery.classList.add("is-visible");

        modal.classList.add("modal");

        document.getElementById("add-photo-form").reset();

        const preview = document.getElementById("image-preview2");
        const uploadContent = document.querySelector(".uploas-content");
        preview.src = "";
        preview.style.display = "none";
        uploadContent.style.display ="flex"
      })
      .catch((error) => console.error("Erreur:", error));
  });

function addNewWorkToGallery(work) {
  const gallery = document.querySelector(".gallery");
  const modalGallery = document.querySelector(".modal-gallery");

  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);

  gallery.appendChild(figure);
  modalGallery.appendChild(figure.cloneNode(true));
}

function populateCategories() {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
      const select = document.getElementById("category");
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });
    })
    .catch((error) => console.error("Erreur:", error));
}

populateCategories();

// previsualisation de l'image
document.getElementById("image").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const preview = document.getElementById("image-preview2");
  const uploadContent = document.querySelector(".upload-content");
  const reader = new FileReader();
  if (file) {
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "flex";
      uploadContent.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// Logout
document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  const portfolioSection = document.querySelector('#portfolio');
  const editBox = document.querySelector('.edit-box');

  if (token) {
    portfolioSection.classList.add('logged-in')
  
    const loginLink = document.querySelector('nav ul li a[href="login.html"]');
    loginLink.textContent = 'logout'
    loginLink.href = '#';
    loginLink.classList.add('logout-link');

    loginLink.addEventListener('click', function () {
      // Deconnexion
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  } else {
    portfolioSection.classList.remove('logged-in');
    editBox.style.display = 'none';
  }
});


