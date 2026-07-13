// Renders a CSS grid of images from a plain JS array.
// Because the grid has no fixed positions, deleting an entry
// from the array is all it takes: the rest reflow on their own.
//
// An item can have either a single "src", or an "images" array
// when a tattoo has several photos. Clicking the thumbnail cycles
// through them, no popup, no text.
function renderGrid(containerId, items, emptyLabel) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!items || items.length === 0) {
    container.classList.add("empty");
    container.setAttribute("data-empty-label", emptyLabel || "Rien à afficher pour le moment.");
    return;
  }

  items.forEach(function (item) {
    const photos = item.images || [item.src];
    let index = 0;

    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = photos[index];
    img.alt = item.alt || "";
    img.loading = "lazy";
    figure.appendChild(img);

    if (photos.length > 1) {
      figure.classList.add("multi");

      // Preload every photo in this set right away, so the click just
      // swaps to an image already in the browser's cache, no delay.
      photos.forEach(function (src) {
        const preload = new Image();
        preload.src = src;
      });

      const dots = document.createElement("div");
      dots.className = "dots";
      photos.forEach(function () {
        const dot = document.createElement("span");
        dots.appendChild(dot);
      });
      figure.appendChild(dots);

      const updateDots = function () {
        Array.from(dots.children).forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      };
      updateDots();

      figure.addEventListener("click", function () {
        index = (index + 1) % photos.length;
        img.src = photos[index];
        updateDots();
      });
    }

    container.appendChild(figure);
  });
}
