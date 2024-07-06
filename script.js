document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:5112/ingredients", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      setSelectorData(".multiple-ingridient-select", data);
    })
    .catch((error) => console.error("Error fetching recipes:", error));

  fetch("http://localhost:5112/tags", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      setSelectorData(".multiple-tags-select", data);
    })
    .catch((error) => console.error("Error fetching recipes:", error));

  $(".multiple-tags-select").on("change", () => {
    onFiltersChanged();
  });

  $(".multiple-ingridient-select").on("change", () => {
    onFiltersChanged();
  });

  const recipesContainer = document.getElementById("recipe-container");
  fetch("http://localhost:5112/recipes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((recipe) => {
        const card = createCard(recipe);
        recipesContainer.appendChild(card);
      });
    })
    .catch((error) => console.error("Error fetching recipes:", error));

  const searchbar = document.getElementById("search");
  searchbar.addEventListener("submit", (event) => {
    event.preventDefault();
    onSearchChanged();
  });
});

function setSelectorData(selector, data) {
  $(selector).select2({
    tags: true,
    tokenSeparators: [","],
    data: data,
  });
}

function onSearchChanged() {
  document.getElementById("recipe-container").innerHTML = "";
  var searchValue = document.getElementById("search-bar").value;
  console.log(searchValue);

  fetch("http://localhost:5112/recipes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((recipe) => {
        if (recipe.name.toLowerCase().includes(searchValue.toLowerCase())) {
          const card = createCard(recipe);
          document.getElementById("recipe-container").appendChild(card);
        }
      });
    })
    .catch((error) => console.error("Error fetching recipes:", error));
}

function onFiltersChanged() {
  document.getElementById("recipe-container").innerHTML = "";

  var ingridents = [];
  $(".multiple-ingridient-select")
    .select2("data")
    .forEach((element) => {
      ingridents.push(element.text);
    });

  var tags = [];
  $(".multiple-tags-select")
    .select2("data")
    .forEach((element) => {
      tags.push(element.text);
    });

  fetch("http://localhost:5112/recipes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((recipe) => {
        let containsAllIngridients = ingridents.every((v) =>
          recipe.ingridients.includes(v)
        );
        let containAllTags = tags.every((v) => recipe.tags.includes(v));

        if (containsAllIngridients && containAllTags) {
          const card = createCard(recipe);
          document.getElementById("recipe-container").appendChild(card);
        }
      });
    })
    .catch((error) => console.error("Error fetching recipes:", error));
}

function createCard(recipe) {
  const card = document.createElement("div");
  card.classList.add("card", "m-3");

  const cardImg = document.createElement("img");
  cardImg.classList.add("card-img-top", "h-50", "mt-2");
  cardImg.src = recipe.imageUrl;
  cardImg.alt = "Card image cap";
  card.appendChild(cardImg);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const cardTitle = document.createElement("div");
  cardTitle.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );

  const titleLink = document.createElement("a");
  titleLink.href = `recipe.html?id=${recipe.id}`;
  titleLink.classList.add("recipe-link", "my-1");
  cardTitle.appendChild(titleLink);

  const cardTitleText = document.createElement("h5");
  cardTitleText.classList.add("card-title");
  cardTitleText.textContent = recipe.name;
  titleLink.appendChild(cardTitleText);

  const menuIcon = document.createElement("div");
  menuIcon.classList.add("menu-icon");
  menuIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 7c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm0 6c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2z"/></svg>
    `;
  cardTitle.appendChild(menuIcon);

  const dropdownMenu = document.createElement("div");
  dropdownMenu.classList.add("dropdown-menu");
  dropdownMenu.innerHTML = `
        <a href="#" class="dropdown-item edit-action">Edit</a>
        <a href="#" class="dropdown-item remove-action">Remove</a>
    `;
  dropdownMenu.style.display = "none";
  cardBody.appendChild(dropdownMenu);

  menuIcon.addEventListener("click", () => {
    dropdownMenu.style.display =
      dropdownMenu.style.display === "none" ? "block" : "none";
  });

  dropdownMenu.querySelector(".edit-action").addEventListener("click", (e) => {
    e.preventDefault();
    console.log(`Edit action for recipe id: ${recipe.id}`);

    window.location.href = `edit.html?id=${recipe.id}`;
  });

  dropdownMenu
    .querySelector(".remove-action")
    .addEventListener("click", (e) => {
      e.preventDefault();
      console.log(`Remove action for recipe id: ${recipe.id}`);

      fetch(`http://localhost:5112/recipes/${recipe.id}`, {
        method: "DELETE",
      });

      card.remove();
    });

  cardBody.appendChild(cardTitle);

  const cardTime = document.createElement("p");
  cardTime.classList.add("card-text", "text-secondary");
  cardTime.innerHTML = `
        <svg class="mr-1" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
            <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 11h6v1h-7v-9h1v8z"/>
        </svg>
        ${recipe.prepTime} Minut/y`;
  cardBody.appendChild(cardTime);

  const cardTags = document.createElement("p");
  cardTags.classList.add("card-text", "text-truncate", "font-weight-light", "text-secondary");
  cardTags.textContent = recipe.tags.join(" ");
  cardBody.appendChild(cardTags);

  card.appendChild(cardBody);
  return card;
}
