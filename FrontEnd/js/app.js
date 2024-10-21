//!  --------- Variables globales pour le titre et la galerie
const addPhotoTitle = document.querySelector("#addPhotoTitle");
const galleryTitle = document.querySelector("#galleryTitle");

//!  --------- Variables globales pour le formulaire d'ajout de photo
const addPhotoView = document.querySelector(".modal-add-photo-view");
const submitBtn = document.querySelector(".submit-btn");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image-preview2");
const uploadContent = document.querySelector(".upload-content");
const addPhotoForm = document.getElementById("add-photo-form");

//!  --------- Variables globales pour la galerie et le menu de catégories
const gallery = document.querySelector(".gallery");
const categoryMenu = document.querySelector(".category-menu"); // Menu des catégories

//!  --------- Variables pour la gestion des modales
const modalAll = document.querySelector(".modal");
const modalBtnAddPhoto = document.querySelector(".modal-btn-add-photo");
const modalGalleryView = document.querySelector(".modal-gallery-view");
const modalGallery = document.querySelector("#modal-gallery");
const modalGalleryClass = document.querySelector(".modal-gallery");
const addPhotoModal = document.getElementById("modal-add-photo");
const jsModal = document.querySelector(".js-modal");

//!  --------- Variable pour le retour à la galerie
const backToGallery = document.querySelector(".back-to-gallery");

//!  --------- Formulaire de contact
const contactForm = document.getElementById("contactForm");

//!  --------- Vérification de la connexion de l'utilisateur
const logged = window.localStorage.getItem("token") || false;

//!  --------- Variable pour suivre la modale active
let modal = null;

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

  categoryMenu.innerHTML = "";

  // Creer un bouton pour chaque categorie
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category;
    button.classList.add("category-button"); // Ajoute une classe CSS
    button.addEventListener("click", () =>
      filterWorksByCategory(category, works),
    );
    categoryMenu.appendChild(button);
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

//!  --------- Formulaire - contact
const handleContactFormSubmit = function () {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    console.log(`Nom: ${name}, Email: ${email}, Message: ${message}`);
  });
};

// Fonction pour ouvrir une modale
const openModal = function (modalElement) {
  if (!modalElement) {
    console.error("La fonction openModal nécessite un modalElement");
    return;
  }

  // Si une autre modale est déjà ouverte, on la ferme avant d'ouvrir la nouvelle
  if (modal) {
    closeModal();
  }

  modal = modalElement; // Assigne la nouvelle modale

  // Affiche la modale et met à jour les attributs ARIA
  modal.style.display = "flex"; // Affiche la modale
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");

  // Si la modale est celle de la galerie, ajoute les projets dedans
  if (modal.id === "modal-gallery") {
    console.log("Ajout des travaux à la modale de galerie"); // Vérifier si cette ligne s'exécute
    addWorksToModal(worksData); // Appelle la fonction qui ajoute les projets à la modale
  }

  // Empêche la fermeture de la modale lorsqu'on clique sur les éléments internes
  modal.querySelectorAll(".js-modal-stop").forEach((element) => {
    element.addEventListener("click", stopPropagation);
  });

  // Ajoute l'écouteur pour fermer la modale lorsqu'on clique sur le bouton de fermeture
  const closeButton = modal.querySelector(".js-modal-close");
  if (closeButton) {
    closeButton.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        closeModal(); // Ferme la modale lorsque vous cliquez sur le bouton
      },
      { once: true }, // Ajoute une seule fois l'événement
    );
  }

  // Ferme la modale si on clique à l'extérieur
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(); // Ferme la modale si on clique à l'extérieur
    }
  });
};

// Fonction pour empêcher la propagation des événements (clic à l'intérieur de la modale)
const stopPropagation = function (e) {
  e.stopPropagation();
};

// Fonction pour fermer la modale
const closeModal = function () {
  if (modal === null) return;

  // Cache la modale et met à jour les attributs ARIA
  modal.style.display = "none"; // Cache la modale
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");

  // Retire les événements de propagation sur les éléments internes
  modal.querySelectorAll(".js-modal-stop").forEach((element) => {
    element.removeEventListener("click", stopPropagation);
  });

  modal = null;
};

// Ajout des écouteurs sur les éléments qui ouvrent les modales via un clic
document.querySelectorAll(".js-modal").forEach((trigger) => {
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(trigger.getAttribute("href"));
    openModal(target);
  });
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
  const isConfirmed = confirm("Voulez-vous vraiment supprimer ce travail ?");
  if (!isConfirmed) {
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token non trouvé. Vous n'êtes pas connecté.");
    return;
  }
  const url = `http://localhost:5678/api/works/${workId}`;

  fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(
            text || `Échec de la suppression avec le statut ${response.status}`,
          );
        });
      }

      // Suppression réussie
      figureElement.remove(); // Supprime l'élément de la galerie directement
      console.log(`Work with ID ${workId} was deleted.`);
      getWorks(); // Actualisation de la galerie et de la modale après suppression
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression:", error.message);
      alert(
        "Une erreur est survenue lors de la suppression. Veuillez réessayer.",
      );
    });
}

//!  --------- Fonction pour basculer entre les modales
function toggleModals() {
  // Vérifier si les éléments existent
  if (!modalBtnAddPhoto || !addPhotoModal || !backToGallery) {
    console.error("Un ou plusieurs éléments DOM ne sont pas trouvés");
    return;
  }

  // Gestion de l'événement du clic sur "Ajouter une photo"
  modalBtnAddPhoto.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Bouton Ajouter une photo cliqué");

    // Ouvrir la modale d'ajout de photo
    openModal(addPhotoModal);
    addPhotoModal.querySelector(".modal-add-photo-view").style.display = "flex"; // Affiche la vue ajout photo
  });

  // Gestion du retour à la galerie
  backToGallery.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Bouton Retour à la galerie cliqué");

    // Fermer la modale d'ajout de photo
    closeModal();

    // Ouvrir la modale de galerie
    openModal(modalGallery);
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
