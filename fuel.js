const statesAndUTs = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
    "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// Sample Fuel Prices for Last 10 Years
const fuelPrices = {};
const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

// Generating sample high and low fuel prices for each state/UT for the last 10 years
statesAndUTs.forEach(state => {
    fuelPrices[state] = {};
    years.forEach(year => {
        const petrolHigh = (Math.random() * (120 - 90) + 90).toFixed(2);
        const petrolLow = (Math.random() * (petrolHigh - 85) + 85).toFixed(2);
        const dieselHigh = (Math.random() * (105 - 80) + 80).toFixed(2);
        const dieselLow = (Math.random() * (dieselHigh - 75) + 75).toFixed(2);
        
        fuelPrices[state][year] = {
            high: { petrol: `₹${petrolHigh}`, diesel: `₹${dieselHigh}` },
            low: { petrol: `₹${petrolLow}`, diesel: `₹${dieselLow}` }
        };
    });
});

// Populate State Dropdown
function populateDropdown() {
    const dropdown = document.getElementById("region");
    dropdown.innerHTML = '<option value="">-- Select State/UT --</option>';
    statesAndUTs.forEach(state => {
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
    years.forEach(year => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    });
}

// Get Fuel Price for Selected State and Year
function getFuelPrice() {
    const region = document.getElementById("region").value;
    const year = parseInt(document.getElementById("year").value);
    const resultElement = document.getElementById("result");

    if (!region || !year) {
        resultElement.textContent = "⚠️ Please select both a state and a year.";
        return;
    }

    const statePrices = fuelPrices[region];

    if (statePrices && statePrices[year]) {
        const { high, low } = statePrices[year];
        resultElement.innerHTML = `
            <strong>📅 Fuel Prices in ${region} for ${year}:</strong><br>
            ⛽ Petrol: Highest - ${high.petrol} | Lowest - ${low.petrol} <br>
            🚛 Diesel: Highest - ${high.diesel} | Lowest - ${low.diesel}
        `;
    } else {
        resultElement.textContent = "❌ Price data not available for the selected year.";
    }
}

// Initialize dropdowns on page load
document.addEventListener("DOMContentLoaded", () => {
    populateDropdown();
    populateYearDropdown();
});
