function OnImageSelected(event) {
  var file = event.target.files[0];

  document.getElementById("thumbnail").src = URL.createObjectURL(file);
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeID = urlParams.get("id");

  if (recipeID) {
    fetch(`http://localhost:5112/recipes/${recipeID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        document.title = `What to Eat: ${data.name}`;

        document.getElementById("recipeId").setAttribute("value", recipeID);
        document.getElementById("recipeTitle").setAttribute("value", data.name);
        document.getElementById("thumbnail").src = data.imageUrl;
        document
          .getElementById("preparationTime")
          .setAttribute("value", data.prepTime);
        document.getElementById("description").innerHTML = data.descrition;

        fetch("http://localhost:5112/ingredients", {
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

        fetch("http://localhost:5112/tags", {
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

        var ingridientSelector = $(".multiple-ingridient-select");
        data.ingridients.forEach((element) => {
          var option = new Option(element, 0, true, true);
          ingridientSelector.append(option).trigger("change");
        });

        var tagSelector = $(".multiple-tags-select");

        data.tags.forEach((element) => {
          var option = new Option(element, 0, true, true);
          tagSelector.append(option).trigger("change");
        });

        var form = document.getElementById("recipe-form");
        form.addEventListener("submit", function (event) {
          event.preventDefault();

          var form = event.target;
          var formData = new FormData(form);

          var recipeImage =
            "Resources/Images/" + formData.get("recipeImage").name;

          if (formData.get("recipeImage").name == "")
            var recipeImage = document.getElementById("thumbnail").src;

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
          console.log(recipeObject);

          fetch(`http://localhost:5112/recipes/${recipeID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: jsonData,
          })
            .then(() => {
              window.location.href = `recipe.html?id=${recipeID}`;
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
      });
  }
});
