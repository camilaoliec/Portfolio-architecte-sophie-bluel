// Fonction pour ajouter les projets à la galerie
function addWorksToGallery(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; //Efface la galerie

    works.forEach(work => {
        const figure = document.createElement('figure');

        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;

        const figcaption = document.createElement('figcaption');
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

    // Extrairee les categories de projets
    works.forEach(work => {
        categories.add(work.category.name);
    });

    const menu = document.querySelector('.category-menu'); // Ajoute l'élemeny de menu de categorie
    menu.innerHTML = '';

    // Creer un bouton pour chaque categorie
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.classList.add('category-button'); // Ajoute une classe CSS
        button.addEventListener('click', () => filterWorksByCategory (category, works))
        menu.appendChild(button);
    });
}

// Function pour filtrer par categorie
function filterWorksByCategory(category, works) {
    if (category === "Tous") {
        addWorksToGallery(works);
    } else {
        const filteredWorks = works.filter(work => work.category.name === category);
        addWorksToGallery(filteredWorks);
    }
}

// L’appel à l’API avec fetch
async function getworks () {
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const works = await response.json();
        console.log(works);   // vérifie les données reçues
        addWorksToGallery(works); //Appelle la fonction pour ajouter des projets à la galerie.
        generateCategoryMenu(works); //Appellle la fonction pour generer le menu categories
    } catch (error) {
        console.error(error.message);
    }
}

getworks(); // Apelle à la fonction

// Formulaire - Login 
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    //Capturer les données du formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const data = {
      email: email,
      password: password
    };
  
    fetch('http://localhost:5678/api/login', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Erreur d\'authentification');
      }
    }) 
    .then(data => {
      localStorage.setItem('token', data.token);
  
      window.location.href = 'index.html';
    })
    .catch(error => {
      document.getElementById('error-message').textContent = "Identifiant ou mot de passe incorrect";
    });
  });
  
      