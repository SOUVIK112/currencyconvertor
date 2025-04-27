document.addEventListener("DOMContentLoaded", async () => {
    const titaniumCountrySelect = document.getElementById("titaniumCountrySelect");
    const titaniumYearSelect = document.getElementById("titaniumYearSelect");

    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();

        const countries = data
            .map((country) => {
                const code = Object.keys(country.currencies || {})[0];
                const countryCode = country.cca2;
                const flag = countryCode
                    ? String.fromCodePoint(...[...countryCode.toUpperCase()].map(c => 127397 + c.charCodeAt(0)))
                    : "";

                return { name: country.name.common, code: code, flag: flag };
            })
            .filter((c) => c.code)
            .sort((a, b) => a.name.localeCompare(b.name));

        countries.forEach((cur) => {
            const option = document.createElement("option");
            option.value = cur.code;
            option.textContent = `${cur.flag} ${cur.name} (${cur.code})`;
            titaniumCountrySelect.appendChild(option);
        });

        titaniumCountrySelect.value = "INR";

        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 10; year <= currentYear; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            titaniumYearSelect.appendChild(option);
        }

        titaniumYearSelect.value = currentYear;
    } catch (error) {
        console.error("Error fetching country data:", error);
    }
});

// Function to generate latest titanium rates for ALL countries dynamically
const generateTitaniumRates = () => {
    return {
       "USD": 150, "INR": 12500, "GBP": 140, "AUD": 210, "CAD": 180, "EUR": 160,
        "JPY": 25000, "CNY": 1200, "AED": 600, "ZAR": 3000, "SGD": 170, "CHF": 155,
        "SEK": 1200, "NOK": 1300, "DKK": 900, "NZD": 190, "HKD": 1200, "THB": 5800,
        "MYR": 800, "KRW": 200000, "BRL": 850, "MXN": 3000, "PHP": 11000, "IDR": 3000000,
        "SAR": 600, "QAR": 550, "KWD": 150, "BHD": 170, "OMR": 180, "EGP": 5000,
        "PKR": 35000, "BDT": 18000, "LKR": 55000, "NGN": 280000, "COP": 750000,
        "ARS": 200000, "VES": 2200000, "UAH": 8000, "RON": 900, "BGN": 350, "HRK": 1200,
        "ISK": 2300, "MAD": 1800, "DZD": 30000, "TND": 700, "MUR": 9500, "XAF": 12000,
        "XOF": 12500, "CDF": 50000, "ZMW": 300, "MZN": 12000, "NAD": 350,
        "BWP": 250, "SZL": 350, "LSL": 350, "ETB": 1000, "SOS": 10500,
        "DJF": 3200, "SDG": 1300, "SYP": 2500, "IQD": 26000, "JOD": 140,
        "LBP": 19000, "YER": 5000, "AFN": 1800, "MVR": 300, "NPR": 2700,
        "MMK": 54000, "KHR": 75000, "LAK": 390000, "BND": 180, "FJD": 450,
        "XPF": 1200, "TMT": 4500, "AMD": 4800, "GEL": 480, "AZN": 230, "BYN": 450,
        "MNT": 54000, "KYD": 140, "BSD": 150, "BMD": 150, "BBD": 300, "HTG": 1500,
        "PAB": 150, "ANG": 260, "AWG": 260, "SRD": 2100, "GYD": 3000, "TTD": 950,
        "JMD": 2000, "BZD": 300, "PGK": 520, "SBD": 1200, "VUV": 1700, "WST": 370,
        "TOP": 320, "KMF": 700, "SCR": 190, "MGA": 680, "RWF": 1500, "AOA": 11000,
        "MWK": 14000, "GNF": 130000, "SLL": 17000, "LRD": 2500, "CVE": 140, "BIF": 550,
        "GMD": 850, "STD": 30000, "ERN": 200, "KPW": 11000, "SSP": 130, "TJS": 1500,
        "UZS": 160000, "MRU": 550, "FOK": 140, "GGP": 140, "IMP": 140, "JEP": 140,
        "SHP": 140
    };
};

// Function to generate historical rates for each country (2015-2024)
const generateHistoricalTitaniumRates = (baseRates) => {
    const historicalRates = {};

    for (let year = 2015; year <= 2024; year++) {
        historicalRates[year] = {};

        Object.keys(baseRates).forEach((currency) => {
            const rate = baseRates[currency];
            historicalRates[year][currency] = {
                high: Math.round(rate * (1.2 + Math.random() * 0.2)), // High rate
                low: Math.round(rate * (0.8 - Math.random() * 0.2)) // Low rate
            };
        });
    }

    return historicalRates;
};

// Generate titanium rates
const titaniumRatesMarch2025 = generateTitaniumRates();
const historicalTitaniumRates = generateHistoricalTitaniumRates(titaniumRatesMarch2025);

// Function to display titanium rate
function displayTitaniumRate() {
    const currency = document.getElementById("titaniumCountrySelect").value;
    const year = parseInt(document.getElementById("titaniumYearSelect").value);
    const resultElement = document.getElementById("titaniumResult");

   /* if (year === 2025) {
        resultElement.textContent = `💠 Titanium Rate in March 2025: ${titaniumRatesMarch2025[currency]} ${currency} per kg`;
    } else {
        const { high, low } = historicalTitaniumRates[year][currency] || {};
        resultElement.textContent = high && low
            ? `📅 Titanium Rates in ${year}: Highest - ${high} ${currency}, Lowest - ${low} ${currency} per kg`
            : "Historical rate data not available.";
    } */
            if (year === 2025) {  
                resultElement.innerHTML = `💠 <strong>Titanium Rate in March 2025: ${titaniumRatesMarch2025[currency]} <strong>${currency} per kg</strong>`;  
            } else {  
                const { high, low } = historicalTitaniumRates[year][currency] || {};  
                resultElement.innerHTML = high && low  
                    ? `📅 <strong>Titanium Rates in ${year}: Highest - <strong>${high} ${currency}, Lowest - ${low} ${currency} per kg</strong>`  
                    : "<strong>Historical rate data not available.</strong>";  
            }
            
}
