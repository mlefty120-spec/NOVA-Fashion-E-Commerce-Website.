/* NOVA WEBSITE - BASIC JAVASCRIPT */
/* This file adds simple actions to the HTML website. */

/* 1. MOBILE MENU: open and close the menu */
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", function () {
  mobileMenu.classList.toggle("open");

  if (mobileMenu.classList.contains("open")) {
    menuToggle.textContent = "×";
    menuToggle.setAttribute("aria-label", "Close menu");
  } else {
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-label", "Open menu");
  }
});

/* 2. MOBILE NAVIGATION: close menu after selecting a link */
const mobileLinks = document.querySelectorAll(".mobile-menu .nav-link");

mobileLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    mobileMenu.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-label", "Open menu");
  });
});

/* 3. SHOPPING BAG: open the bag and add products */
const bagButton = document.getElementById("bagButton");
const bagDrawer = document.getElementById("bagDrawer");
const bagOverlay = document.getElementById("bagOverlay");
const bagClose = document.getElementById("bagClose");
const bagItemsBox = document.getElementById("bagItems");
const bagTotal = document.getElementById("bagTotal");
const bagCount = document.getElementById("bagCount");
let bagItems = [];

function openBag() {
  bagDrawer.classList.add("open");
  bagOverlay.classList.add("open");
  bagDrawer.setAttribute("aria-hidden", "false");
}
function closeBag() {
  bagDrawer.classList.remove("open");
  bagOverlay.classList.remove("open");
  bagDrawer.setAttribute("aria-hidden", "true");
}
function addToBag(item) {
  const existing = bagItems.find(function (bagItem) {
    return bagItem.name === item.name && bagItem.size === item.size;
  });
  if (existing) existing.quantity += item.quantity;
  else bagItems.push(item);
  renderBag();
  openBag();
}
function renderBag() {
  if (!bagItemsBox) return;
  const itemCount = bagItems.reduce(function (sum, item) { return sum + item.quantity; }, 0);
  if (bagCount) bagCount.textContent = itemCount;
  if (bagItems.length === 0) {
    bagItemsBox.innerHTML = '<p class="bag-empty">Your bag is empty. Add a piece you love.</p>';
    bagTotal.textContent = "PKR 0";
    return;
  }
  let total = 0;
  bagItemsBox.innerHTML = bagItems.map(function (item, index) {
    total += item.price * item.quantity;
    return '<div class="bag-item">' +
      '<img src="' + item.image + '" alt="' + item.name + '">' +
      '<div><h3>' + item.name + '</h3><p>Size ' + item.size + ' · Qty ' + item.quantity + '</p><p>PKR ' + (item.price * item.quantity).toLocaleString() + '</p></div>' +
      '<button class="bag-remove" data-remove-index="' + index + '" type="button">Remove</button>' +
      '</div>';
  }).join("");
  bagTotal.textContent = "PKR " + total.toLocaleString();
  if (bagCount) bagCount.textContent = itemCount;
  document.querySelectorAll("[data-remove-index]").forEach(function (button) {
    button.addEventListener("click", function () {
      bagItems.splice(Number(button.getAttribute("data-remove-index")), 1);
      renderBag();
    });
  });
}
if (bagButton) bagButton.addEventListener("click", openBag);
if (bagClose) bagClose.addEventListener("click", closeBag);
if (bagOverlay) bagOverlay.addEventListener("click", closeBag);

/* 4. NEWSLETTER: show a subscribe message */
const newsletterForm = document.getElementById("newsletterForm");

newsletterForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("newsletter-email").value;
  alert("Thank you for subscribing, " + email + "!");
  newsletterForm.reset();
});

/* 5. CONTACT: show a message after form submission */
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  alert("Thank you, " + name + "! Your message has been received.");
  contactForm.reset();
});

/* 6. SHOP FILTER: show products by category */
const filterButtons = document.querySelectorAll(".filter-btn");
const shopCards = document.querySelectorAll("#shopGrid .product-card");
const resultCount = document.getElementById("resultCount");

function showShopCategory(selectedCategory) {
  let visibleProducts = 0;

  filterButtons.forEach(function (button) {
    button.classList.remove("active");

    if (button.getAttribute("data-filter") === selectedCategory) {
      button.classList.add("active");
    }
  });

  shopCards.forEach(function (card) {
    const category = card.getAttribute("data-category");

    if (selectedCategory === "All" || category === selectedCategory) {
      card.classList.remove("is-hidden");
      visibleProducts++;
    } else {
      card.classList.add("is-hidden");
    }
  });

  if (resultCount) {
    resultCount.textContent = visibleProducts + " products";
  }
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    showShopCategory(button.getAttribute("data-filter"));
  });
});

/* 7. COLLECTIONS: connect collection buttons to shop categories */
const collectionLinks = document.querySelectorAll("[data-category-link]");

collectionLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    const category = link.getAttribute("data-category-link");

    setTimeout(function () {
      showShopCategory(category);
    }, 100);
  });
});

/* 8. VIEW PRODUCT: open a professional product details popup */
const productLinks = document.querySelectorAll("[data-product-target]");
const productModal = document.getElementById("productModal");
const modalClose = document.getElementById("modalClose");
const modalProductImage = document.getElementById("modalProductImage");
const modalProductName = document.getElementById("modalProductName");
const modalProductCategory = document.getElementById("modalProductCategory");
const modalProductPrice = document.getElementById("modalProductPrice");
const modalBag = document.getElementById("modalBag");
const productSize = document.getElementById("productSize");
const productQuantity = document.getElementById("productQuantity");
let currentProduct = null;

function openProductModal(card) {
  if (!card || !productModal) return;
  const image = card.querySelector(".image-frame img");
  const name = card.querySelector(".product-name");
  const category = card.querySelector(".product-category");
  const price = card.querySelector(".product-price");
  if (!image || !name) return;
  const priceNumber = Number((price ? price.textContent : "0").replace(/[^0-9]/g, ""));
  currentProduct = { name: name.textContent.trim(), category: category ? category.textContent.trim() : "NOVA Collection", price: priceNumber, image: image.getAttribute("src") };
  modalProductImage.src = currentProduct.image;
  modalProductImage.alt = currentProduct.name;
  modalProductName.textContent = currentProduct.name;
  modalProductCategory.textContent = currentProduct.category;
  modalProductPrice.textContent = "PKR " + currentProduct.price.toLocaleString();
  productQuantity.value = 1;
  productSize.value = "M";
  productModal.classList.add("open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}
function closeProductModal() {
  if (!productModal) return;
  productModal.classList.remove("open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}
productLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const targetId = link.getAttribute("data-product-target");
    openProductModal(document.getElementById(targetId) || link.closest(".product-card"));
  });
});
document.querySelectorAll(".product-card .image-frame img").forEach(function (image) {
  image.style.cursor = "zoom-in";
  image.addEventListener("click", function () { openProductModal(image.closest(".product-card")); });
});
if (modalClose) modalClose.addEventListener("click", closeProductModal);
if (productModal) productModal.addEventListener("click", function (event) { if (event.target === productModal) closeProductModal(); });
if (document.getElementById("quantityMinus")) document.getElementById("quantityMinus").addEventListener("click", function () { productQuantity.value = Math.max(1, Number(productQuantity.value) - 1); });
if (document.getElementById("quantityPlus")) document.getElementById("quantityPlus").addEventListener("click", function () { productQuantity.value = Math.min(10, Number(productQuantity.value) + 1); });
if (modalBag) modalBag.addEventListener("click", function () {
  if (!currentProduct) return;
  addToBag({ name: currentProduct.name, price: currentProduct.price, image: currentProduct.image, size: productSize.value, quantity: Number(productQuantity.value) || 1 });
  closeProductModal();
});

/* 9. DIRECT ADD TO BAG: quick add from product cards */
document.querySelectorAll(".add-bag").forEach(function (button) {
  button.addEventListener("click", function () {
    if (button.id === "modalBag") return;
    const card = button.closest(".product-card");
    if (!card) return;
    const image = card.querySelector(".image-frame img");
    const name = card.querySelector(".product-name");
    const price = card.querySelector(".product-price");
    addToBag({
      name: name.textContent.trim(),
      price: Number(price.textContent.replace(/[^0-9]/g, "")),
      image: image.getAttribute("src"),
      size: "M",
      quantity: 1
    });
  });
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") { closeProductModal(); closeBag(); }
});

/* 10. DATA ANALYSIS: calculate simple product performance metrics */
const salesData = [
  { product: "Aira Lawn Set", category: "3 Piece", sales: 120, revenue: 1308000 },
  { product: "Elara Co-Ord", category: "Co-Ord", sales: 95, revenue: 883550 },
  { product: "Meher Silk Kurta", category: "Kurta", sales: 85, revenue: 934150 },
  { product: "Zoya Festive Set", category: "Festive", sales: 65, revenue: 1202500 },
  { product: "Inaya Signature Suit", category: "Signature", sales: 50, revenue: 1245000 }
];
const totalProducts = document.getElementById("totalProducts");
const totalUnits = document.getElementById("totalUnits");
const totalRevenue = document.getElementById("totalRevenue");
const bestSeller = document.getElementById("bestSeller");
const analysisTableBody = document.getElementById("analysisTableBody");
const salesChart = document.getElementById("salesChart");
if (totalProducts) {
  const units = salesData.reduce(function (sum, item) { return sum + item.sales; }, 0);
  const revenue = salesData.reduce(function (sum, item) { return sum + item.revenue; }, 0);
  const best = salesData.reduce(function (top, item) { return item.sales > top.sales ? item : top; }, salesData[0]);
  totalProducts.textContent = salesData.length;
  totalUnits.textContent = units;
  totalRevenue.textContent = "PKR " + revenue.toLocaleString();
  bestSeller.textContent = best.product;
  analysisTableBody.innerHTML = salesData.map(function (item) {
    return '<tr><td>' + item.product + '</td><td>' + item.category + '</td><td>' + item.sales + '</td><td>PKR ' + item.revenue.toLocaleString() + '</td></tr>';
  }).join("");
  const maxSales = Math.max.apply(null, salesData.map(function (item) { return item.sales; }));
  salesChart.innerHTML = salesData.map(function (item) {
    const width = (item.sales / maxSales) * 100;
    return '<div class="chart-row"><span class="chart-label">' + item.product + '</span><div class="chart-track"><div class="chart-fill" style="width:' + width + '%"></div></div><b class="chart-value">' + item.sales + '</b></div>';
  }).join("");
}

