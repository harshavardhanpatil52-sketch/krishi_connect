// ───────────────────────────────────────────
//  KrishiConnect — script.js
// ───────────────────────────────────────────

// ── NOTIFICATION ──
function showNotif(msg) {
  var n = document.getElementById("notif");
  n.textContent = msg;
  n.classList.add("show");
  setTimeout(function () {
    n.classList.remove("show");
  }, 3000);
}

// ── CROP RECOMMENDATION DATA ──
// Maps: state + soil + season → top 3 crops
var cropData = {
  "Maharashtra|Black Cotton|Kharif (Jun-Oct)": [
    { crop: "Cotton",    emoji: "🫚", score: 97, price: "Rs 5,800/q", why: "Best fit for black soil. High MSP support." },
    { crop: "Soybean",   emoji: "🫘", score: 91, price: "Rs 4,200/q", why: "Water-efficient. Good market demand."       },
    { crop: "Red Chilli",emoji: "🌶", score: 85, price: "Rs 6,500/q", why: "High returns with proper irrigation."       }
  ],
  "Maharashtra|Black Cotton|Rabi (Nov-Mar)": [
    { crop: "Chickpea",  emoji: "🫘", score: 93, price: "Rs 5,100/q", why: "Low water need. Fixes soil nitrogen."       },
    { crop: "Wheat",     emoji: "🌾", score: 88, price: "Rs 2,200/q", why: "Stable MSP. Easy to sell."                  },
    { crop: "Safflower", emoji: "🌸", score: 82, price: "Rs 4,800/q", why: "Drought tolerant. Niche market."            }
  ],
  "Maharashtra|Alluvial|Kharif (Jun-Oct)": [
    { crop: "Maize",     emoji: "🌽", score: 95, price: "Rs 1,900/q", why: "High yield on alluvial soil."               },
    { crop: "Turmeric",  emoji: "🟡", score: 89, price: "Rs 8,200/q", why: "Excellent spice market returns."            },
    { crop: "Sugarcane", emoji: "🎋", score: 87, price: "Rs 3,100/q", why: "Good river-belt crop."                      }
  ],
  "Maharashtra|Alluvial|Rabi (Nov-Mar)": [
    { crop: "Onion",     emoji: "🧅", score: 94, price: "Rs 1,800/q", why: "Maharashtra top export crop."               },
    { crop: "Potato",    emoji: "🥔", score: 88, price: "Rs 1,200/q", why: "Steady demand all year."                    },
    { crop: "Wheat",     emoji: "🌾", score: 83, price: "Rs 2,200/q", why: "Reliable MSP-backed crop."                  }
  ],
  "Punjab|Alluvial|Kharif (Jun-Oct)": [
    { crop: "Rice",      emoji: "🌾", score: 98, price: "Rs 2,183/q", why: "Irrigated Punjab — perfect for paddy."      },
    { crop: "Maize",     emoji: "🌽", score: 89, price: "Rs 1,900/q", why: "Water-saving alternative to paddy."         },
    { crop: "Cotton",    emoji: "🫚", score: 84, price: "Rs 6,080/q", why: "Malwa belt specialty crop."                 }
  ],
  "Punjab|Alluvial|Rabi (Nov-Mar)": [
    { crop: "Wheat",     emoji: "🌾", score: 99, price: "Rs 2,275/q", why: "Punjab crown crop. MSP always assured."     },
    { crop: "Potato",    emoji: "🥔", score: 88, price: "Rs 1,200/q", why: "High export demand from Punjab."            },
    { crop: "Mustard",   emoji: "🌼", score: 85, price: "Rs 5,650/q", why: "Good oilseed returns in Rabi."             }
  ],
  "Gujarat|Sandy / Loamy|Kharif (Jun-Oct)": [
    { crop: "Groundnut", emoji: "🥜", score: 96, price: "Rs 5,500/q", why: "Sandy loam is ideal for groundnut."        },
    { crop: "Cotton",    emoji: "🫚", score: 91, price: "Rs 5,800/q", why: "Gujarat is India's top cotton state."       },
    { crop: "Castor",    emoji: "🌿", score: 86, price: "Rs 6,000/q", why: "Drought-resistant, good export demand."     }
  ],
  "Uttar Pradesh|Alluvial|Rabi (Nov-Mar)": [
    { crop: "Wheat",     emoji: "🌾", score: 98, price: "Rs 2,275/q", why: "UP's largest Rabi crop. MSP assured."      },
    { crop: "Mustard",   emoji: "🌼", score: 90, price: "Rs 5,650/q", why: "Good oilseed demand. Low input cost."      },
    { crop: "Pea",       emoji: "🫛", score: 84, price: "Rs 2,800/q", why: "Quick cycle, good winter crop."            }
  ]
};

// Tips based on water availability
var waterTips = {
  "Irrigated": [
    "Use drip irrigation to save up to 40% water.",
    "Plan fertigation schedule with your irrigation cycles.",
    "Maintain irrigation records for subsidy claims."
  ],
  "Semi-Irrigated": [
    "Choose crops with moderate water needs.",
    "Mulching can reduce water loss by up to 30%.",
    "Harvest rainwater in small farm ponds."
  ],
  "Rain-fed Only": [
    "Choose drought-tolerant varieties whenever possible.",
    "Use contour bunding to hold rainwater on slopes.",
    "Sow as soon as monsoon arrives for maximum moisture use."
  ]
};

// ── GET RECOMMENDATION ──
function getRecommendation() {
  var state   = document.getElementById("r-state").value;
  var soil    = document.getElementById("r-soil").value;
  var season  = document.getElementById("r-season").value;
  var water   = document.getElementById("r-water").value;
  var land    = document.getElementById("r-land").value;
  var budget  = document.getElementById("r-budget").value;

  if (!state || !soil || !season || !water || !land || !budget) {
    alert("Please fill in all fields to get recommendations.");
    return;
  }

  var key = state + "|" + soil + "|" + season;
  var crops = cropData[key];

  // Fallback if exact combo not in database
  if (!crops) {
    crops = getDefaultCrops(season);
  }

  renderResults(crops, water, land);
}

function getDefaultCrops(season) {
  if (season === "Kharif (Jun-Oct)") {
    return [
      { crop: "Soybean",   emoji: "🫘", score: 88, price: "Rs 4,200/q", why: "Widely adaptable Kharif crop."   },
      { crop: "Maize",     emoji: "🌽", score: 84, price: "Rs 1,900/q", why: "Good yield across most soils."    },
      { crop: "Groundnut", emoji: "🥜", score: 80, price: "Rs 5,500/q", why: "Reliable oilseed crop."           }
    ];
  } else if (season === "Rabi (Nov-Mar)") {
    return [
      { crop: "Wheat",    emoji: "🌾", score: 91, price: "Rs 2,275/q", why: "Most common Rabi crop. MSP stable." },
      { crop: "Chickpea", emoji: "🫘", score: 87, price: "Rs 5,100/q", why: "Low cost, good returns."           },
      { crop: "Mustard",  emoji: "🌼", score: 82, price: "Rs 5,650/q", why: "Easy oilseed crop for Rabi."       }
    ];
  } else {
    return [
      { crop: "Watermelon", emoji: "🍉", score: 89, price: "Rs 1,200/q", why: "High demand in summer months."  },
      { crop: "Moong Dal",  emoji: "🫘", score: 84, price: "Rs 7,200/q", why: "Quick cycle of 60 days."        },
      { crop: "Cucumber",   emoji: "🥒", score: 80, price: "Rs 900/q",   why: "Easy summer vegetable crop."    }
    ];
  }
}

function renderResults(crops, water, land) {
  var grid = document.getElementById("results-grid");
  var tipsBox = document.getElementById("result-tips");
  grid.innerHTML = "";

  crops.forEach(function (c, i) {
    var card = document.createElement("div");
    card.className = "result-card" + (i === 0 ? " top" : "");
    card.innerHTML =
      (i === 0 ? '<span class="top-label">Best Match</span><br>' : "") +
      '<div class="emoji">' + c.emoji + "</div>" +
      "<h4>" + c.crop + "</h4>" +
      '<div class="match">' + c.score + "%</div>" +
      '<div class="why">' + c.why + "</div>" +
      '<div class="price-tag">Avg: ' + c.price + "</div>";
    grid.appendChild(card);
  });

  // Show tips
  var tips = waterTips[water] || [];
  var landNum = parseFloat(land);
  if (landNum && landNum > 5) {
    tips = tips.concat(["Consider growing 2 crops in rotation to reduce risk."]);
  }

  tipsBox.innerHTML =
    "<h4>Tips for your farm</h4><ul>" +
    tips.map(function (t) { return "<li>" + t + "</li>"; }).join("") +
    "</ul>";

  var resultsDiv = document.getElementById("reco-results");
  resultsDiv.style.display = "block";
  resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── MARKETPLACE: PRICE HINT ──
function updatePriceHint() {
  var select = document.getElementById("m-crop");
  var option = select.options[select.selectedIndex];
  var price  = option.getAttribute("data-price");
  var hint   = document.getElementById("price-hint");

  if (price) {
    hint.style.display = "block";
    hint.textContent =
      "💡 Current mandi rate for " + option.text + " is around Rs " +
      parseInt(price).toLocaleString("en-IN") +
      "/quintal. You can price higher for Grade A quality.";
  } else {
    hint.style.display = "none";
  }
}

// ── SUBMIT LISTING ──
function submitListing() {
  var crop  = document.getElementById("m-crop").value;
  var qty   = document.getElementById("m-qty").value;
  var grade = document.getElementById("m-grade").value;
  var price = document.getElementById("m-price").value;
  var loc   = document.getElementById("m-loc").value;

  if (!crop || !qty || !grade || !price || !loc) {
    alert("Please fill in all listing fields.");
    return;
  }

  // Add to the listings panel
  var newListing = {
    crop:   crop,
    qty:    qty,
    grade:  grade,
    price:  price,
    loc:    loc,
    fresh:  true
  };

  liveListings.unshift(newListing);
  renderListings();

  // Clear form
  document.getElementById("m-crop").value  = "";
  document.getElementById("m-qty").value   = "";
  document.getElementById("m-grade").value = "";
  document.getElementById("m-price").value = "";
  document.getElementById("m-loc").value   = "";
  document.getElementById("price-hint").style.display = "none";

  showNotif("Listing posted! Buyers can now see your produce.");
}

// ── LIVE LISTINGS DATA ──
var liveListings = [
  { crop: "Wheat",      qty: 50,  grade: "Grade A (Premium)", price: 2400,  loc: "Ludhiana, Punjab",       fresh: false },
  { crop: "Onion",      qty: 30,  grade: "Grade B (Standard)", price: 1600, loc: "Nashik, Maharashtra",    fresh: false },
  { crop: "Turmeric",   qty: 15,  grade: "Grade A (Premium)", price: 8500,  loc: "Sangli, Maharashtra",    fresh: false },
  { crop: "Soybean",    qty: 40,  grade: "Grade B (Standard)", price: 4100, loc: "Indore, Madhya Pradesh", fresh: true  },
  { crop: "Red Chilli", qty: 20,  grade: "Grade A (Premium)", price: 7000,  loc: "Guntur, Andhra Pradesh", fresh: false },
  { crop: "Potato",     qty: 60,  grade: "Grade B (Standard)", price: 1150, loc: "Agra, Uttar Pradesh",    fresh: false }
];

function renderListings() {
  var container = document.getElementById("listings-container");
  container.innerHTML = "";

  liveListings.forEach(function (l) {
    var card = document.createElement("div");
    card.className = "listing-card";
    card.innerHTML =
      '<div class="listing-left">' +
        '<span class="badge ' + (l.fresh ? "fresh" : "selling") + '">' +
          (l.fresh ? "Just Listed" : "Active") +
        "</span>" +
        '<div class="crop-name">' + l.crop + " — " + l.grade + "</div>" +
        '<div class="farmer-loc">📍 ' + l.loc + "</div>" +
      "</div>" +
      '<div class="listing-right">' +
        '<div class="price">Rs ' + parseInt(l.price).toLocaleString("en-IN") + "/q</div>" +
        '<div class="qty">Qty: ' + l.qty + " quintals</div>" +
        '<button class="buy-btn" onclick="contactSeller(\'' + l.crop + "', '\" + l.loc + \"')>Contact Buyer</button>" +
      "</div>";

    // Fix: proper string (rebuild without template literal confusion)
    card.innerHTML =
      '<div class="listing-left">' +
        '<span class="badge ' + (l.fresh ? "fresh" : "selling") + '">' + (l.fresh ? "Just Listed" : "Active") + "</span>" +
        '<div class="crop-name">' + l.crop + " — " + l.grade + "</div>" +
        '<div class="farmer-loc">📍 ' + l.loc + "</div>" +
      "</div>" +
      '<div class="listing-right">' +
        '<div class="price">Rs ' + parseInt(l.price).toLocaleString("en-IN") + "/q</div>" +
        '<div class="qty">Qty: ' + l.qty + " quintals</div>" +
        "<button class='buy-btn' onclick=\"contactSeller('" + l.crop + "', '" + l.loc + "')\">Contact Buyer</button>" +
      "</div>";

    container.appendChild(card);
  });
}

function contactSeller(crop, loc) {
  showNotif("Request sent for " + crop + " from " + loc + "! Seller will contact you soon.");
}

// ── INIT ──
renderListings();
