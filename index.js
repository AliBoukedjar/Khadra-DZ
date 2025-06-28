/*function sendLikeToServer(plantId, isLiked) {
  fetch("http:///like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plantId: plantId,
      liked: isLiked,
    }),
  }).catch((err) => {
    console.error("Failed to send like to server:", err);
  });
}*/
fetch("plants.json")
  .then((response) => response.json())
  .then((plants) => {
    const container = document.querySelector(".plants-grid");
    const featuredPlants = plants.slice(0, 6);
    const likedPlants = JSON.parse(localStorage.getItem("likedPlants")) || [];

    featuredPlants.forEach((plant) => {
      const card = document.createElement("div");
      card.className = "plant-card";

      // Check if plant is already liked
      const isLiked = likedPlants.includes(plant.id);

      card.innerHTML = `
        <button class="like-btn ${
          isLiked ? "liked" : ""
        }" aria-label="Like this plant">
          <i class="${isLiked ? "fas" : "far"} fa-heart"></i>
        </button>
        ${
          plant.bestseller ? '<div class="bestseller-tag">Bestseller</div>' : ""
        }
        <img src="${plant.image_url}" alt="${plant.name}" class="plant-img">
        <div class="plant-info">
          <h3>${plant.name}</h3>
          <p>${plant.description || "A lovely plant."}</p>
          <div class="plant-price">
            ${plant.price ? "$" + plant.price : "Price: Coming soon"}
          </div>
        </div>
      `;

      // Handle broken image
      const img = card.querySelector("img");
      img.onerror = function () {
        this.onerror = null;
        this.src = "";
        this.alt = "";
        this.insertAdjacentHTML(
          "afterend",
          '<div class="no-image">Image coming soon</div>'
        );
        this.style.display = "none";
      };

      // Like button functionality
      const likeBtn = card.querySelector(".like-btn");
      likeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isNowLiked = !likeBtn.classList.contains("liked");

        likeBtn.classList.toggle("liked");
        likeBtn.innerHTML = `<i class="${
          isNowLiked ? "fas" : "far"
        } fa-heart"></i>`;

        // Update localStorage
        let likedPlants = JSON.parse(localStorage.getItem("likedPlants")) || [];
        if (isNowLiked) {
          if (!likedPlants.includes(plant.id)) {
            likedPlants.push(plant.id);
          }
        } else {
          likedPlants = likedPlants.filter((id) => id !== plant.id);
        }
        localStorage.setItem("likedPlants", JSON.stringify(likedPlants));
        sendLikeToServer(plant.id, isNowLiked);
      });

      // Card click functionality
      card.addEventListener("click", () => {
        window.location.href = `plant-detail.html?plantId=${plant.id}`;
      });

      container.appendChild(card);
    });
  })
  .catch((error) => console.error("Failed to load plants:", error));
