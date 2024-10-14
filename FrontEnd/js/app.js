// Variable goblal
const addPhotoTitle = document.querySelector("#addPhotoTitle");
const galerietitle = document.querySelector("#galleryTitle");

const addPhotoView = document.querySelector(".modal-add-photo-view");
const submitBtn = document.querySelector(".submit-btn");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const gallery = document.querySelector(".gallery");
const imageInput = document.getElementById("image-preview2");
const uploadContent = document.querySelector(".upload-content");
const addPhotoForm = document.getElementById("add-photo-form");
const categotyMenu = document.querySelector(".category-menu"); // Ajoute l'élement de menu de categorie

//!  --------- Variables pour les modales
const modalAll = document.querySelector(".modal");
const modalBtnAddPhoto = document.querySelector(".modal-btn-add-photo");
const modalGalleryView = document.querySelector(".modal-gallery-view");
const modalGallery = document.querySelector("#modal-gallery");
const modalGalleryClass = document.querySelector(".modal-gallery");
const addPhotoModal = document.getElementById("modal-add-photo");
const jsModal = document.querySelector(".js-modal");

//!  ---------  Retour a la galerie
const backToGallery = document.querySelector(".back-to-gallery");

//!  --------- Vérification de la connexion
const loged = window.localStorage.getItem("token") || false;

//!  --------- Fonction pour ajouter les projets à la galerie
function addWorksToGallery(works) {
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

//!  --------- Fonction pour generer dynamiquement le menu de categories
function generateCategoryMenu(works) {
  const categories = new Set();
  categories.add("Tous"); // Ajoute l'option "Tous"

  // Extraire les categories de projets
  works.forEach((work) => {
    if (work.category && work.category.name) {
      categories.add(work.category.name);
    }
  });

  categotyMenu.innerHTML = "";

  // Creer un bouton pour chaque categorie
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category;
    button.classList.add("category-button"); // Ajoute une classe CSS
    button.addEventListener("click", () =>
      filterWorksByCategory(category, works),
    );
    categotyMenu.appendChild(button);
  });
}

//!  --------- Function pour filtrer par categorie
function filterWorksByCategory(category, works) {
  if (category === "Tous") {
    addWorksToGallery(works);
  } else {
    const filteredWorks = works.filter(
      (work) => work.category.name === category,
    );
    addWorksToGallery(filteredWorks);
  }
}

//!  --------- L’appel à l’API avec fetch
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

const stopPropagation = function (e) {
  e.stopPropagation();
};

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));

  if (!target) return;

  // Si une autre modale est déjà ouverte, on la ferme avant d'ouvrir la nouvelle
  if (modal) {
    closeModal(e);
  }
  modal = target;

  modal.classList.add("is-visible");
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");

  if (modal.id === "modal-gallery") {
    addWorksToModal(worksData);
  }

  // Supprime les anciens écouteurs d'événements pour éviter les conflits
  modal.removeEventListener("click", closeModalOnOutsideClick);

  // Ajoute un écouteur pour fermer la modale lorsqu'on clique à l'extérieur
  modal.addEventListener("click", closeModalOnOutsideClick);

  // Empêche la fermeture de la modale lorsqu'on clique sur les éléments internes
  modal
    .querySelectorAll(
      ".js-modal-stop, .modal-gallery-view, .modal-add-photo-view",
    )
    .forEach((element) => {
      element.addEventListener("click", stopPropagation);
    });

  // Ajoute l'écouteur pour fermer la modale lorsqu'on clique sur le bouton de fermeture
  const closeButton = modal.querySelector(".js-modal-close");
  if (closeButton) {
    closeButton.removeEventListener("click", closeModal);
    closeButton.addEventListener("click", closeModal);
  }
};

const closeModal = function (e) {
  if (!modal) return;
  e.preventDefault();

  modal.classList.remove("is-visible");
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");

  // Supprime les écouteurs d'événements pour éviter les conflits
  modal.removeEventListener("click", closeModalOnOutsideClick);

  modal.querySelectorAll(".js-modal-stop").forEach((element) => {
    element.removeEventListener("click", stopPropagation);
  });

  const closeButton = modal.querySelector(".js-modal-close");
  if (closeButton) {
    closeButton.removeEventListener("click", closeModal);
  }

  modal = null;
};

// Ajout des écouteurs d'événements sur les boutons de fermeture
const closeButtons = document.querySelectorAll(".js-modal-close");
closeButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

const closeModalOnOutsideClick = function (e) {
  console.log("Cible du clic:", e.target); // Affiche sur quel élément se produit le clic
  console.log("Modale active:", modal); // Affiche l'élément modale actif

  // Vérifie si le clic est directement sur l'arrière-plan de la modale
  if (e.target === modal) {
    console.log("Clic détecté à l'extérieur de la modale, fermeture en cours.");
    closeModal(e);
  } else {
    console.log("Clic détecté à l'intérieur de la modale, aucune fermeture.");
  }
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

//!  --------- Gestion de la touche Echap pour fermer la modale
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

//!  --------- Fonction pour ajouter les travaux à la modale
function addWorksToModal(works) {
  modalGalleryClass.innerHTML = "";
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
    modalGalleryClass.appendChild(figure);
  });
}

//!  --------- Suppression de travaux existants
function deleteWork(workId, figureElement) {
  const isConfirmed = confirm("Voulez-vous vraiment supprimer ce travail?");
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
        figureElement.remove(); // Supprime l'élément de la galerie directement
        console.log(`Work with ID ${workId} was deleted.`);
        getWorks(); // Actualisation de la galerie et de la modale après suppression
      } else {
        console.error(`Failed to delete work with ID ${workId}`);
      }
    })
    .catch((error) => console.error("Error:", error));
}

//!  --------- Fonction pour basculer entre les modales
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
    if (
      e.target === addPhotoModal ||
      e.target.classList.contains("js-modal-close")
    ) {
      addPhotoView.classList.remove("is-visible");
      addPhotoModal.classList.remove("is-visible");
      addPhotoModal.style.display = "none";
    }
  });

  modalGallery.addEventListener("click", function (e) {
    if (
      e.target === modalGallery ||
      e.target.classList.contains("js-modal-close")
    ) {
      modalGalleryView.classList.remove("is-visible");
      modalGallery.classList.remove("is-visible");
      modalGallery.style.display = "none";
    }
  });
}

//!  --------- Fonction de validation du formulaire en temps réel

function validateAndAddClass() {
  const isTitleValid = titleInput && titleInput.value.trim() !== "";
  const isCategoryValid = categoryInput && categoryInput.value !== "";
  const isImageValid =
    imageInput && imageInput.src !== "" && imageInput.style.display !== "none";

  if (isTitleValid && isCategoryValid && isImageValid) {
    submitBtn.classList.add("green"); // Ajouter la classe "green" si toutes les conditions sont remplies
  } else {
    submitBtn.classList.remove("green"); // Retirer la classe "green" si une des conditions n'est pas remplie
  }
}

// Écouteurs d'événements sur les champs pour une validation en temps réel
document.getElementById("title").addEventListener("input", validateAndAddClass);
document
  .getElementById("category")
  .addEventListener("change", validateAndAddClass);
document
  .getElementById("image-preview2")
  .addEventListener("change", validateAndAddClass);

//!  --------- Fonction pour charger les travaux
function loadWorks() {
  const url = "http://localhost:5678/api/works";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const gallery = document.querySelector(".gallery");
      gallery.innerHTML = ""; // On vide la galerie avant de la re-remplir
      data.forEach((work) => {
        const figureElement = document.createElement("figure");
        figureElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
          `;
        gallery.appendChild(figureElement);
      });
    })
    .catch((error) => console.error("Error loading works:", error));
}

//!  --------- Fonction pour gérer la soumission du formulaire

async function addProject() {
  addPhotoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    validateAndAddClass(); // Vérifier et ajouter la classe "green" avant la soumission
    const formData = new FormData(addPhotoForm);
    console.log(localStorage.getItem("token"));
    if (!localStorage.getItem("token")) {
      console.error("Token non trouvé, utilisateur non connecté.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Success: data", data);
      getWorks(); // Actualisation automatique de la galerie et de la modale après ajout
      // Réinitialisation du formulaire et des éléments après soumission
      addPhotoForm.reset();
      validateAndAddClass(); // Mettre à jour l'état du bouton après réinitialisation
      imageInput.src = "";
      imageInput.style.display = "none";
      uploadContent.style.display = "flex";
    } catch (error) {
      console.error("Erreur:", error);
    }
  });
}

//!  --------- Fonction pour ajouter un nouveau projet à la galerie

function addNewWorkToGallery(work) {
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

//!  --------- Fonction pour recuperer les categories

function populateCategories() {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categoryInput.appendChild(option);
      });
    })
    .catch((error) => console.error("Erreur:", error));
}

//!  --------- previsualisation de l'image

function previewImage() {
  document.getElementById("image").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.onload = function (e) {
        imageInput.src = e.target.result;
        imageInput.style.display = "flex";
        uploadContent.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });
}

//!  --------- Logout
function logout() {
  document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const portfolioSection = document.querySelector("#portfolio");
    const editBox = document.querySelector(".edit-box");

    if (token) {
      portfolioSection.classList.add("logged-in");

      const loginLink = document.querySelector(
        'nav ul li a[href="login.html"]',
      );
      loginLink.textContent = "logout";
      loginLink.href = "#";
      loginLink.classList.add("logout-link");

      loginLink.addEventListener("click", function () {
        // Deconnexion
        localStorage.removeItem("token");
        window.location.href = "index.html";
      });
    } else {
      portfolioSection.classList.remove("logged-in");
      editBox.style.display = "none";
    }
  });
}

//!  --------- Appel de la fonction
logout();
previewImage();
populateCategories();
addProject();
toggleModals();
getWorks();
