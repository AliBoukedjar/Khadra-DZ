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
document.addEventListener("DOMContentLoaded", function () {
  const plantsGrid = document.getElementById("plants-grid");
  if (!plantsGrid) return;

  // Add temporary loader to prevent layout shifts
  plantsGrid.innerHTML = '<div class="loader">Loading plants...</div>';

  fetch("plants.json")
    .then((response) => response.json())
    .then((plants) => {
      plantsGrid.innerHTML = ""; // Clear loader
      const likedPlants = JSON.parse(localStorage.getItem("likedPlants")) || [];

      // Create document fragment for batch DOM insertion
      const fragment = document.createDocumentFragment();

      plants.forEach((plant) => {
        const card = document.createElement("div");
        card.className = "plant-card";
        card.dataset.type = plant.type.split("/")[0];

        // 👉 EXACT SAME LIKE BUTTON IMPLEMENTATION AS FIRST CODE 👈
        const isLiked = likedPlants.includes(plant.id);
        card.innerHTML = `
          <button class="like-btn ${
            isLiked ? "liked" : ""
          }" aria-label="Like this plant">
            <i class="${isLiked ? "fas" : "far"} fa-heart"></i>
          </button>
          ${
            plant.bestseller
              ? '<div class="bestseller-tag">Bestseller</div>'
              : ""
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

        // 👉 EXACT SAME LIKE BUTTON FUNCTIONALITY 👈
        const likeBtn = card.querySelector(".like-btn");
        likeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const isNowLiked = !likeBtn.classList.contains("liked");

          likeBtn.classList.toggle("liked");
          likeBtn.innerHTML = `<i class="${
            isNowLiked ? "fas" : "far"
          } fa-heart"></i>`;

          // Update localStorage
          let updatedLikes =
            JSON.parse(localStorage.getItem("likedPlants")) || [];
          if (isNowLiked) {
            if (!updatedLikes.includes(plant.id)) {
              updatedLikes.push(plant.id);
            }
          } else {
            updatedLikes = updatedLikes.filter((id) => id !== plant.id);
          }
          localStorage.setItem("likedPlants", JSON.stringify(updatedLikes));
          sendLikeToServer(plant.id, isNowLiked);
        });

        // Handle broken image (keep your existing implementation)
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

        // Make the card clickable
        card.addEventListener("click", () => {
          window.location.href = `plant-detail.html?plantId=${plant.id}`;
        });

        fragment.appendChild(card);
      });

      plantsGrid.appendChild(fragment);
      setupFilters();
    })
    .catch((error) => {
      console.error("Error loading plants:", error);
      plantsGrid.innerHTML =
        "<p class='error'>Sorry, we couldn't load the plants. Please try again later.</p>";
    });

  function setupFilters() {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        requestAnimationFrame(() => {
          document.querySelectorAll(".filter-btn").forEach((b) => {
            b.classList.toggle("active", b === btn);
          });

          const filter = this.dataset.filter;
          document.querySelectorAll(".plant-card").forEach((plant) => {
            plant.style.display =
              filter === "all" || plant.dataset.type === filter
                ? "block"
                : "none";
          });
        });
      });
    });
  }
});
card.addEventListener("click", () => {
  window.location.href = `plant-detail.html?plantId=${plant.id}`;
});
