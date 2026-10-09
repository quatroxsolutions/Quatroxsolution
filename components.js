document.addEventListener("DOMContentLoaded", function () {

  // ---------- Load navbar ----------
  fetch("components/navbar.html")
    .then(function (res) {
      if (!res.ok) throw new Error("Navbar could not be loaded");
      return res.text();
    })
    .then(function (html) {
      document.getElementById("navbar").innerHTML = html;
      initNavbar();
    })
    .catch(function (err) { console.error(err); });

  // ---------- Load footer ----------
  fetch("components/footer.html")
    .then(function (res) {
      if (!res.ok) throw new Error("Footer could not be loaded");
      return res.text();
    })
    .then(function (html) {
      document.getElementById("footer").innerHTML = html;
    })
    .catch(function (err) { console.error(err); });

});

// =====================================================
// NAVBAR behavior — runs once navbar.html is injected
// =====================================================
function initNavbar() {
  var navWrap = document.getElementById("quatroxNavWrap");
  var mobileMenu = document.getElementById("mobileMenu");
  if (!navWrap || !mobileMenu) return;

  var hamburger = navWrap.querySelector(".quatrox-hamburger");
  var lastScroll = window.pageYOffset;

  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    mobileMenu.classList.toggle("open");
  });

  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { mobileMenu.classList.remove("open"); });
  });

  document.addEventListener("click", function (e) {
    if (mobileMenu.classList.contains("open") && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      mobileMenu.classList.remove("open");
    }
  });

  window.addEventListener("scroll", function () {
    var current = window.pageYOffset;
    navWrap.classList.toggle("is-scrolled", current > 24);
    if (current > lastScroll && current > 80) {
      navWrap.classList.add("nav-hidden");
      mobileMenu.classList.remove("open");
    } else if (current < lastScroll) {
      navWrap.classList.remove("nav-hidden");
    }
    lastScroll = current;
  });

  // Highlight the current page's link
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  navWrap.querySelectorAll(".quatrox-menu a, .mobile-menu a").forEach(function (link) {
    var href = (link.getAttribute("href") || "").split("#")[0];
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

// =====================================================
// FOOTER behavior — global functions so the footer's
// inline onclick="" attributes (from the injected HTML)
// can find them
// =====================================================
var mapLocations = [
  {
    src: "https://maps.google.com/maps?q=16-74A+HMP+Towers+Market+Rd+Thuckalay+Tamil+Nadu+629175&output=embed&z=15",
    addr: "16-74A, HMP Towers<br>Market Rd, Thuckalay<br>Tamil Nadu — 629175",
    link: "https://maps.google.com/?q=16-74A+HMP+Towers+Market+Rd+Thuckalay+Tamil+Nadu+629175"
  },
  {
    src: "https://maps.google.com/maps?q=Meenakshi+Street+Thirunagar+Madurai+Tamil+Nadu+625006&output=embed&z=15",
    addr: "66, 5-5/9 Meenakshi Street<br>Thirunagar, Madurai<br>Tamil Nadu — 625006",
    link: "https://maps.google.com/?q=Meenakshi+Street+Thirunagar+Madurai+Tamil+Nadu+625006"
  }
];

function openMap() {
  document.getElementById("mapOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeMap() {
  document.getElementById("mapOverlay").classList.remove("open");
  document.body.style.overflow = "";
}
function closeMapOutside(e) {
  if (e.target === document.getElementById("mapOverlay")) closeMap();
}
function switchTab(idx, el) {
  document.querySelectorAll(".map-tab").forEach(function (t) { t.classList.remove("active"); });
  el.classList.add("active");
  var loc = mapLocations[idx];
  document.getElementById("mapFrame").src = loc.src;
  document.getElementById("mapAddr").innerHTML = loc.addr;
  document.getElementById("mapDirBtn").href = loc.link;
}

function openPrivacy() {
  var overlay = document.getElementById("privacyOverlay");
  var modal = document.getElementById("privacyModal");
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  setTimeout(function () {
    modal.style.transform = "translateY(0) scale(1)";
    modal.style.opacity = "1";
  }, 10);
}
function closePrivacy() {
  var overlay = document.getElementById("privacyOverlay");
  var modal = document.getElementById("privacyModal");
  modal.style.transform = "translateY(30px) scale(0.97)";
  modal.style.opacity = "0";
  setTimeout(function () {
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }, 300);
}
function closePrivacyOutside(e) {
  if (e.target === document.getElementById("privacyOverlay")) closePrivacy();
}

function openTerms() {
  var overlay = document.getElementById("termsOverlay");
  var modal = document.getElementById("termsModal");
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  setTimeout(function () {
    modal.style.transform = "translateY(0) scale(1)";
    modal.style.opacity = "1";
  }, 10);
}
function closeTerms() {
  var overlay = document.getElementById("termsOverlay");
  var modal = document.getElementById("termsModal");
  modal.style.transform = "translateY(30px) scale(0.97)";
  modal.style.opacity = "0";
  setTimeout(function () {
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }, 300);
}
function closeTermsOutside(e) {
  if (e.target === document.getElementById("termsOverlay")) closeTerms();
}

document.addEventListener("keydown", function (e) {
  if (e.key !== "Escape") return;
  closeMap();
  closePrivacy();
  closeTerms();
});
