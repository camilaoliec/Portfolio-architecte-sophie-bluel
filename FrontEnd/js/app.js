// Variable goblal
const modalBtnAddPhoto = document.querySelector(".modal-btn-add-photo");
const modalGalleryView = document.querySelector(".modal-gallery-view");
const addPhotoView = document.querySelector(".modal-add-photo-view");
const addPhotoTitle = document.querySelector("#addPhotoTitle");
const modalAddPhoto = document.querySelector("#modal-add-photo");
const galerietitle = document.querySelector("#galleryTitle");
const modalAll = document.querySelector(".modal");
const backToGalery = document.querySelector(".back-to-gallery");

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
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = "flex"; // Annulation du display: none
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;

  if (modal.id === "modal-gallery") {
    addWorksToModal(worksData);
  }
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".modal-gallery-view")
    .addEventListener("click", stopPropagation);
  document
    .querySelector(".modal-add-photo-view")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".modal-gallery-view")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
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

// Modal - Formulaire
  modalBtnAddPhoto.addEventListener("click", function() {
    modalGalleryView.style.display = "none";
    addPhotoView.style.display = "flex";
    addPhotoTitle.textContent = "Ajout photo";
});

backToGalery.addEventListener("click", function () {
  modalGalleryView.style.display = "flex";
  addPhotoView.style.display = "none";
  addPhotoTitle.textContent = "Galerie photo";
});

document
  .getElementById("add-photo-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        addNewWorkToGallery(data);
        document.querySelector(".modal-gallery-view").style.display = "block";
        document.querySelector(".modal-add-photo-view").style.display = "none";
        document.querySelector("#titlemodal").textContent = "Galerie photo";
        this.reset();
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
  const preview = document.getElementById("image-preview");
  const reader = new FileReader();
  if (file) {
    reader.onload = function (e) {
      preview.src = e.target.result;
      document.querySelector(".image-preview").style.display = "flex";
    };
    reader.readAsDataURL(file);
  }
});
