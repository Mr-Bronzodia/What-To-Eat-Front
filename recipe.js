document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeID = urlParams.get("id");

  if (recipeID) {
    fetch(`https://whattoeatapi.azurewebsites.net/recipes/${recipeID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        document.title = `What to Eat: ${data.name}`;
        document.getElementById("title").textContent = data.name;
        document.getElementById("main-image").src = data.imageUrl;
        document.getElementById(
          "prep-time"
        ).textContent = `Praparation Time: ${data.prepTime} minutes`;
        document.getElementById("description").textContent = data.descrition;

        const ingridientList = document.getElementById("ingredients");
        data.ingridients.forEach((element) => {
          const li = document.createElement("li");
          li.textContent = element;
          ingridientList.appendChild(li);
        });

        const tagList = document.getElementById("tags");
        data.tags.forEach((element) => {
          const li = document.createElement("li");
          const span = document.createElement("span");
          span.textContent = element;
          span.classList.add("tag");
          li.appendChild(span);
          tagList.appendChild(li);
        });
      });
  }
});
