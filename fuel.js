const statesAndUTs = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// Generate last 10 years
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

// Generate sample Fuel Prices for all States/UTs
const fuelPrices = {};
statesAndUTs.forEach((state) => {
  fuelPrices[state] = {};
  years.forEach((year) => {
    const petrolCurrent = +(Math.random() * (120 - 90) + 90).toFixed(2);
    const dieselCurrent = +(Math.random() * (105 - 80) + 80).toFixed(2);
    const petrolHigh = +(petrolCurrent * 1.05).toFixed(2); // simulated
    const petrolLow = +(petrolCurrent * 0.95).toFixed(2);
    const dieselHigh = +(dieselCurrent * 1.05).toFixed(2);
    const dieselLow = +(dieselCurrent * 0.95).toFixed(2);

    fuelPrices[state][year] = {
      current: { petrol: `₹${petrolCurrent}`, diesel: `₹${dieselCurrent}` },
      high: { petrol: `₹${petrolHigh}`, diesel: `₹${dieselHigh}` },
      low: { petrol: `₹${petrolLow}`, diesel: `₹${dieselLow}` },
    };
  });
});

// Populate State Dropdown
function populateDropdown() {
  const dropdown = document.getElementById("region");
  dropdown.innerHTML = '<option value="">-- Select State/UT --</option>';
  statesAndUTs.forEach((state) => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    dropdown.appendChild(option);
  });
}

// Populate Year Dropdown
function populateYearDropdown() {
  const yearDropdown = document.getElementById("year");
  yearDropdown.innerHTML = '<option value="">-- Select Year --</option>';
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearDropdown.appendChild(option);
  });
}

// Fetch and Display Fuel Price for selected State and Year
function getFuelPrice() {
  const region = document.getElementById("region").value;
  const year = parseInt(document.getElementById("year").value);
  const resultElement = document.getElementById("result");

  if (!region || !year) {
    resultElement.innerHTML =
      "⚠️ <strong>Please select both a State/UT and a Year.</strong>";
    return;
  }

  const statePrices = fuelPrices[region];

  if (statePrices && statePrices[year]) {
    const { current, high, low } = statePrices[year];
    const today = new Date();
    const monthName = today.toLocaleString("default", { month: "long" });

    if (year === today.getFullYear()) {
      // Show Current Month's Rates
      resultElement.innerHTML = `
                <strong>⛽ Fuel Prices in ${region} for ${monthName} ${year}:</strong><br><br>
                Petrol: ${current.petrol}<br>
                Diesel: ${current.diesel}
            `;
    } else {
      // Show High/Low for Historical Years
      resultElement.innerHTML = `
                <strong>📅 Fuel Prices in ${region} for ${year}:</strong><br><br>
                ⛽ Petrol:<br> 
                ➔ Highest - ${high.petrol}<br> 
                ➔ Lowest - ${low.petrol}<br><br>
                🚛 Diesel:<br> 
                ➔ Highest - ${high.diesel}<br> 
                ➔ Lowest - ${low.diesel}
            `;
    }
  } else {
    resultElement.innerHTML =
      "❌ <strong>Price data not available for the selected year.</strong>";
  }
}

// Initialize dropdowns when page loads
document.addEventListener("DOMContentLoaded", () => {
  populateDropdown();
  populateYearDropdown();
});
