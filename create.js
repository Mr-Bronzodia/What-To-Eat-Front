document.addEventListener("DOMContentLoaded", () => {
  fetch("https://whattoeatapi.azurewebsites.net/ingredients", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $(".multiple-ingridient-select").select2({
        tags: true,
        tokenSeparators: [","],
        data: data,
      });
    })
    .catch((error) => console.error("Error fetching recipes:", error));

  fetch("https://whattoeatapi.azurewebsites.net/tags", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $(".multiple-tags-select").select2({
        tags: true,
        tokenSeparators: [","],
        data: data,
      });
    })
    .catch((error) => console.error("Error fetching recipes:", error));

  var form = document.getElementById("recipe-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var form = event.target;
    var formData = new FormData(form);

    var recipeImage = "Resources/Images/" + formData.get("recipeImage").name;
    var recipeTitle = formData.get("recipeTitle");
    var preparationTime = formData.get("preparationTime");
    var ingredients = [];
    var tags = [];
    var description = formData.get("description");

    $(".multiple-ingridient-select")
      .select2("data")
      .forEach((element) => {
        ingredients.push(element.text);
      });

    $(".multiple-tags-select")
      .select2("data")
      .forEach((element) => {
        tags.push(element.text);
      });

    var recipeObject = {
      name: recipeTitle,
      descrition: description,
      imageUrl: recipeImage,
      prepTime: preparationTime,
      ingridients: ingredients,
      tags: tags,
    };

    var jsonData = JSON.stringify(recipeObject);

    fetch(`https://whattoeatapi.azurewebsites.net/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);

        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

function OnImageSelected(event) {
  var file = event.target.files[0];

  document.getElementById("thumbnail").src = URL.createObjectURL(file);
}
