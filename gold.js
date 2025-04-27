document.addEventListener("DOMContentLoaded", async () => {
    const goldCountrySelect = document.getElementById("goldCountrySelect");
    const goldYearSelect = document.getElementById("goldYearSelect");

    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();

        const countries = data
            .map((country) => {
                const code = Object.keys(country.currencies || {})[0]; // Get currency code
                const countryCode = country.cca2; // Two-letter country code
                const flag = countryCode
                    ? String.fromCodePoint(...[...countryCode.toUpperCase()].map(c => 127397 + c.charCodeAt(0)))
                    : ""; // Unicode flag

                return {
                    name: country.name.common,
                    code: code,
                    flag: flag
                };
            })
            .filter((c) => c.code) // Remove countries without currency
            .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

        // Populate country dropdown
        countries.forEach((cur) => {
            const option = document.createElement("option");
            option.value = cur.code;
            option.textContent = `${cur.flag} ${cur.name} (${cur.code})`;
            goldCountrySelect.appendChild(option);
        });

        goldCountrySelect.value = "INR"; // Default selection

        // Populate last 10 years dropdown
        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 10; year <= currentYear; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            goldYearSelect.appendChild(option);
        }

        goldYearSelect.value = currentYear; // Default to current year
    } catch (error) {
        console.error("Error fetching country data:", error);
    }
});

// Function to generate latest gold rates for ALL world currencies
const generateGoldRates = () => {
    return {
        "USD": 97, "INR": 8885, "GBP": 76, "AUD": 157, "CAD": 142, "EUR": 91,
        "JPY": 10200, "CNY": 700, "AED": 340, "ZAR": 1750, "SGD": 129, "CHF": 87,
        "SEK": 750, "NOK": 800, "DKK": 550, "NZD": 125, "HKD": 754, "THB": 3400,
        "MYR": 480, "KRW": 120000, "BRL": 520, "MXN": 1800, "PHP": 6500, "IDR": 1800000,
        "SAR": 400, "QAR": 380, "KWD": 70, "BHD": 85, "OMR": 89, "EGP": 3200,
        "PKR": 20000, "BDT": 11500, "LKR": 35000, "NGN": 150000, "COP": 480000,
        "ARS": 110000, "VES": 1200000, "UAH": 4500, "RON": 500, "BGN": 210, "HRK": 750,
        "ISK": 1400, "MAD": 1100, "DZD": 18000, "TND": 400, "MUR": 5800, "XAF": 6800,
        "XOF": 7000, "CDF": 28000, "ZMW": 200, "MZN": 6800, "NAD": 210,
        "BWP": 150, "SZL": 210, "LSL": 210, "ETB": 600, "SOS": 6200,
        "DJF": 1900, "SDG": 800, "SYP": 1500, "IQD": 16000, "JOD": 85,
        "LBP": 11500, "YER": 3000, "AFN": 1050, "MVR": 170, "NPR": 1600,
        "MMK": 32000, "KHR": 45000, "LAK": 230000, "BND": 120, "FJD": 250,
        "XPF": 700, "TMT": 2500, "AMD": 2700, "GEL": 270, "AZN": 130, "BYN": 250,
        "MNT": 31000, "KYD": 85, "BSD": 90, "BMD": 90, "BBD": 180, "HTG": 880,
        "PAB": 90, "ANG": 160, "AWG": 160, "SRD": 1300, "GYD": 1800, "TTD": 580,
        "JMD": 1300, "BZD": 180, "PGK": 310, "SBD": 680, "VUV": 1000, "WST": 220,
        "TOP": 190, "KMF": 410, "SCR": 110, "MGA": 390, "RWF": 890, "AOA": 6500,
        "MWK": 8500, "GNF": 80000, "SLL": 10000, "LRD": 1500, "CVE": 85, "BIF": 330,
        "GMD": 510, "STD": 18000, "ERN": 120, "TJS": 880, "UZS": 92000, "MRU": 320
    }; 
  
};

// Generate historical gold prices (randomized for demo)
const generateHistoricalGoldRates = (currentRates) => {
    const historicalRates = {};
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 10; year < currentYear; year++) {
        historicalRates[year] = {};
        Object.keys(currentRates).forEach(currency => {
            const basePrice = currentRates[currency];
            const high = Math.round(basePrice * (0.7+ Math.random() * 0.2)); // High: +10-30%
            const low = Math.round(basePrice * (0.5+ Math.random() * 0.2)); // Low: -30-50%
            historicalRates[year][currency] = { high, low };
        });
    }

    return historicalRates;
};

// Get gold rates for March 2025 and historical prices
const goldRatesMarch2025 = generateGoldRates();
const historicalGoldRates = generateHistoricalGoldRates(goldRatesMarch2025);

// Function to display gold price based on selected year
function displayGoldRate() {
    const currency = document.getElementById("goldCountrySelect").value;
    const year = parseInt(document.getElementById("goldYearSelect").value);
    const resultElement = document.getElementById("goldResult");

            if (year === 2025) {
                resultElement.innerHTML = `🔶 <strong>Gold Rate in March 2025: ${goldRatesMarch2025[currency]} ${currency} per gram</strong>`;
            } else {
                const { high, low } = historicalGoldRates[year][currency] || {};
                resultElement.innerHTML = high && low
                    ? `📅 <strong>Gold Rates in ${year}:</strong><br>
                       <strong>Highest - ${high} ${currency}</strong><br>
                       <strong>Lowest - ${low} ${currency} per gram </strong>`
                    : "<strong>Historical rate data not available.</strong>";
            }
            
}

       
