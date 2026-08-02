// ==========================================================================
// SAPATOS DE PASSI — app.js
// Firebase Realtime Database wiring + product form + live rendering.
// Uses the compat SDK (global `firebase` / `db`), so no ES modules needed.
// ==========================================================================

const productsRef = db.ref("products");

// ==========================================================================
// DOM references
// ==========================================================================

const modal = document.getElementById("productModal");
const openFormBtn = document.getElementById("openFormBtn");
const closeFormBtn = document.getElementById("closeFormBtn");
const cancelFormBtn = document.getElementById("cancelFormBtn");

const productForm = document.getElementById("productForm");
const formStatus = document.getElementById("formStatus");

const idInput = document.getElementById("productId");
const nameInput = document.getElementById("productName");
const genderInput = document.getElementById("productGender");
const sizeInput = document.getElementById("productSize");
const imageInput = document.getElementById("productImage");
const imagePreview = document.getElementById("imagePreview");

const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");

document.getElementById("year").textContent = new Date().getFullYear();

// ==========================================================================
// Modal open / close
// ==========================================================================

function openModal() {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  productForm.reset();
  imagePreview.hidden = true;
  formStatus.textContent = "";
}

openFormBtn.addEventListener("click", openModal);
closeFormBtn.addEventListener("click", closeModal);
cancelFormBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// ==========================================================================
// Image preview + base64 conversion (image is stored as a base64 string
// directly in the Realtime Database, so no separate Storage setup is needed)
// ==========================================================================

let currentImageBase64 = "";

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) {
    currentImageBase64 = "";
    imagePreview.hidden = true;
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    currentImageBase64 = reader.result;
    imagePreview.src = currentImageBase64;
    imagePreview.hidden = false;
  };
  reader.readAsDataURL(file);
});

// ==========================================================================
// Save product to Firebase
// ==========================================================================

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const product = {
    productId: idInput.value.trim(),
    name: nameInput.value.trim(),
    gender: genderInput.value,
    size: sizeInput.value,
    image: currentImageBase64 || "",
    createdAt: Date.now(),
  };

  if (!product.productId || !product.name || !product.gender || !product.size) {
    formStatus.textContent = "Please fill in all required fields.";
    return;
  }

  formStatus.style.color = "var(--olive-600)";
  formStatus.textContent = "Saving...";

  try {
    await productsRef.push(product);
    formStatus.textContent = "Saved.";
    currentImageBase64 = "";
    setTimeout(closeModal, 400);
  } catch (err) {
    console.error(err);
    formStatus.style.color = "var(--rust-600)";
    formStatus.textContent = "Could not save product. Check your Firebase database rules.";
  }
});

// ==========================================================================
// Live render of the product shelf
// ==========================================================================

function renderProducts(snapshotVal) {
  productGrid.innerHTML = "";

  if (!snapshotVal) {
    productGrid.appendChild(emptyState);
    return;
  }

  const entries = Object.values(snapshotVal).sort(
    (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
  );

  entries.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const photo = document.createElement(product.image ? "img" : "div");
    photo.className = "product-photo" + (product.image ? "" : " placeholder");
    if (product.image) {
      photo.src = product.image;
      photo.alt = product.name;
    } else {
      photo.textContent = "No photo";
    }

    const idTag = document.createElement("p");
    idTag.className = "product-id";
    idTag.textContent = `ID · ${product.productId}`;

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name;

    const meta = document.createElement("div");
    meta.className = "product-meta";

    const genderPill = document.createElement("span");
    genderPill.className = "tag-pill";
    genderPill.textContent = product.gender;

    const sizePill = document.createElement("span");
    sizePill.className = "tag-pill";
    sizePill.textContent = `Size ${product.size}`;

    meta.append(genderPill, sizePill);
    card.append(photo, idTag, name, meta);
    productGrid.appendChild(card);
  });
}

productsRef.on("value", (snapshot) => {
  renderProducts(snapshot.val());
});

