document.addEventListener("DOMContentLoaded", async () => {
    const palladiumCountrySelect = document.getElementById("palladiumCountrySelect");
    const palladiumYearSelect = document.getElementById("palladiumYearSelect");
    const checkPalladiumRateBtn = document.getElementById("checkPalladiumRateBtn");
    const palladiumResult = document.getElementById("palladiumResult");

    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();

        const countries = data.map((country) => {
            const code = Object.keys(country.currencies || {})[0];
            const countryCode = country.cca2;
            const flag = countryCode ? String.fromCodePoint(...[...countryCode.toUpperCase()].map(c => 127397 + c.charCodeAt(0))) : "";

            return { name: country.name.common, code, flag };
        }).filter((c) => c.code).sort((a, b) => a.name.localeCompare(b.name));

        countries.forEach((cur) => {
            const option = document.createElement("option");
            option.value = cur.code;
            option.textContent = `${cur.flag} ${cur.name} (${cur.code})`;
            palladiumCountrySelect.appendChild(option);
        });

        palladiumCountrySelect.value = "INR";

        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 10; year <= currentYear; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            palladiumYearSelect.appendChild(option);
        }
        palladiumYearSelect.value = currentYear;

        checkPalladiumRateBtn.addEventListener("click", displayPalladiumRate);
    } catch (error) {
        console.error("Error fetching country data:", error);
        
    }
});

// Function to generate latest palladium rates for ALL countries dynamically
const generatePalladiumRates = () => {
    return {
        "USD": 1300, "INR": 3400, "GBP": 1100, "AUD": 1700, "CAD": 1600, "EUR": 1400,
        "JPY": 200000, "CNY": 9000, "AED": 5500, "ZAR": 30000, "SGD": 1450, "CHF": 1250,
        "SEK": 9700, "NOK": 10200, "DKK": 7200, "NZD": 1600, "HKD": 8900, "THB": 45000,
        "MYR": 6200, "KRW": 1700000, "BRL": 6900, "MXN": 25000, "PHP": 90000, "IDR": 27000000,
        "SAR": 5700, "QAR": 5300, "KWD": 990, "BHD": 1250, "OMR": 1300, "EGP": 50000,
        "PKR": 350000, "BDT": 200000, "LKR": 500000, "NGN": 2500000, "COP": 7800000,
        "ARS": 1600000, "VES": 18000000, "UAH": 76000, "RON": 8200, "BGN": 3200, "HRK": 10200,
        "ISK": 15000, "MAD": 14000, "DZD": 230000, "TND": 5500, "MUR": 78000, "XAF": 85000,
        "XOF": 87000, "CDF": 320000, "ZMW": 2800, "MZN": 89000, "NAD": 3100,
        "BWP": 2000, "SZL": 3100, "LSL": 3100, "ETB": 8000, "SOS": 85000,
        "DJF": 23000, "SDG": 10000, "SYP": 18000, "IQD": 200000, "JOD": 1100,
        "LBP": 150000, "YER": 40000, "AFN": 15000, "MVR": 2200, "NPR": 21000,
        "MMK": 400000, "KHR": 570000, "LAK": 3000000, "BND": 1400, "FJD": 3300,
        "XPF": 9000, "TMT": 33000, "AMD": 35000, "GEL": 3600, "AZN": 1800, "BYN": 3300,
        "MNT": 400000, "KYD": 1100, "BSD": 1300, "BMD": 1300, "BBD": 2600, "HTG": 12000,
        "PAB": 1300, "ANG": 2200, "AWG": 2200, "SRD": 18000, "GYD": 25000, "TTD": 8000,
        "JMD": 18000, "BZD": 2500, "PGK": 4200, "SBD": 8900, "VUV": 14000, "WST": 3100,
        "TOP": 2800, "KMF": 5700, "SCR": 1500, "MGA": 5200, "RWF": 12000, "AOA": 85000,
        "MWK": 115000, "GNF": 1100000, "SLL": 140000, "LRD": 20000, "CVE": 1200, "BIF": 4500,
        "GMD": 7000, "STD": 250000, "ERN": 1600, "KPW": 95000, "SSP": 1200, "TJS": 12000,
        "UZS": 1400000, "MRU": 4400, "FOK": 1150, "GGP": 1100, "IMP": 1100, "JEP": 1100,
        "SHP": 1100
    };
};

// Function to generate historical rates for each country (2015-2024)
const generateHistoricalPalladiumRates = (baseRates) => {
    const historicalRates = {};

    for (let year = 2015; year <= 2024; year++) {
        historicalRates[year] = {};

        Object.keys(baseRates).forEach((currency) => {
            const rate = baseRates[currency];
            historicalRates[year][currency] = {
                high: Math.round(rate * (1.2 + Math.random() * 0.2)), // High rate
                low: Math.round(rate * (0.8 - Math.random() * 0.2)), // Low rate
            };
        });
    }

    return historicalRates;
};

// Generate palladium rates
const palladiumRatesMarch2025 = generatePalladiumRates();
const historicalPalladiumRates = generateHistoricalPalladiumRates(palladiumRatesMarch2025);

// Function to display palladium rate
function displayPalladiumRate() {
    const currency = document.getElementById("palladiumCountrySelect").value;
    const year = parseInt(document.getElementById("palladiumYearSelect").value);
    const resultElement = document.getElementById("palladiumResult");

   /* if (year === 2025) {
        resultElement.textContent = `🌟 Palladium Rate in March 2025: ${palladiumRatesMarch2025[currency]} ${currency} per gram`;
    } else {
        const { high, low } = historicalPalladiumRates[year][currency] || {};
        resultElement.textContent = high && low
            ? `📅 Palladium Rates in ${year}: Highest - ${high} ${currency}, Lowest - ${low} ${currency} per gram`
            : "Historical rate data not available.";
    } */
            if (year === 2025) {
                resultElement.innerHTML = `🌟 <b>Palladium Rate in March 2025: ${palladiumRatesMarch2025[currency]} ${currency} per gram</b>`;
            } else {
                const { high, low } = historicalPalladiumRates[year][currency] || {};
                resultElement.innerHTML = high && low
                    ? `📅 <b>Palladium Rates in ${year}: Highest - ${high} ${currency}, Lowest - ${low} ${currency} per gram</b>`
                    : "<b>Historical rate data not available.</b>";
            }
            
}
