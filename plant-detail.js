document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const urlParams = new URLSearchParams(window.location.search);
  const plantId = urlParams.get("plantId");
  console.log("URL Parameters:", { plantId });

  // Show loading states
  const detailImage = document.querySelector(".detail-image");
  const detailInfo = document.querySelector(".detail-info");

  if (detailImage) detailImage.classList.add("loading");
  if (detailInfo) detailInfo.classList.add("loading");

  console.log("Starting fetch request for plants.json...");

  fetch("plants.json")
    .then((res) => {
      console.log("Received response from plants.json");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((plants) => {
      console.log("Successfully parsed plants.json", plants);
      console.log(
        "All plant IDs:",
        plants.map((p) => p.id)
      );

      const plant = plants.find((p) => {
        console.log(
          `Comparing: URL ID (${plantId}, type ${typeof plantId}) with Plant ID (${
            p.id
          }, type ${typeof p.id})`
        );
        return p.id == plantId;
      });

      console.log("Found plant:", plant);

      if (!plant) {
        document.querySelector(".plant-detail").innerHTML = `
          <div class="error-state">
            <h2>Plant Not Found</h2>
           
            <a href="all-plants.html" class="btn">Back to All Plants</a>
          </div>
        `;
        return;
      }

      // Remove loading states
      if (detailImage) detailImage.classList.remove("loading");
      if (detailInfo) detailInfo.classList.remove("loading");

      // Debug selectors
      console.log("Attempting to populate data...");
      const nameElement = document.getElementById("plant-name");
      const imageElement = document.getElementById("plant-image");
      const scientificElement = document.getElementById("plant-scientific");
      const descElement = document.getElementById("plant-description");
      const careList = document.getElementById("plant-care");

      console.log("Found elements:", {
        nameElement,
        imageElement,
        scientificElement,
        descElement,
        careList,
      });

      // Populate basic info
      if (nameElement) nameElement.textContent = plant.name;
      if (imageElement) {
        imageElement.src = plant.image_url || ""; // Handle missing image_url
        imageElement.alt = plant.name;

        // Add error handling for image
        imageElement.onerror = function () {
          console.log("Image failed to load:", this.src);
          this.onerror = null; // Prevent infinite loop
          this.src = ""; // Remove broken image icon
          this.alt = ""; // Remove alt text to avoid redundancy
          this.insertAdjacentHTML(
            "afterend",
            '<div class="no-image">Image coming soon</div>'
          );
          this.style.display = "none"; // Hide the empty img tag
        };
      }

      document.title = `${plant.name} | Green Haven`;

      // Optional fields
      if (scientificElement) {
        if (plant.scientific_name) {
          scientificElement.textContent = plant.scientific_name;
        } else {
          scientificElement.style.display = "none";
        }
      }

      // Description
      if (descElement) {
        descElement.textContent =
          plant.description || "A beautiful addition to any plant collection.";
      }

      // Care guide
      if (careList) {
        careList.innerHTML = "";
        if (plant.care) {
          Object.entries(plant.care).forEach(([key, value]) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${key.replace(
              /_/g,
              " "
            )}</strong>: ${value}`;
            careList.appendChild(li);
          });
        } else {
          careList.innerHTML =
            "<li>Detailed care information coming soon!</li>";
        }
      }

      console.log("Plant details populated successfully");
    })
    .catch((error) => {
      console.error("Error loading plant:", error);
      const detailContainer = document.querySelector(".plant-detail");
      if (detailContainer) {
        detailContainer.innerHTML = `
          <div class="error-state">
            <h2>Couldn't load plant details</h2>
            <p>We're having trouble loading this plant. Please try again later.</p>
            <p>Error: ${error.message}</p>
            <a href="all-plants.html" class="btn">Back to All Plants</a>
          </div>
        `;
      }
    });
});
