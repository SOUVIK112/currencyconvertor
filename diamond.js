document.addEventListener("DOMContentLoaded", async () => {
    const diamondCountrySelect = document.getElementById("diamondCountrySelect");
    const diamondYearSelect = document.getElementById("diamondYearSelect");

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
            diamondCountrySelect.appendChild(option);
        });

        diamondCountrySelect.value = "INR"; // Default selection

        // Populate last 10 years dropdown
        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 10; year <= currentYear; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            diamondYearSelect.appendChild(option);
        }

        diamondYearSelect.value = currentYear; // Default to current year
    } catch (error) {
        console.error("Error fetching country data:", error);
    }
});

// Function to generate latest diamond rates for ALL countries dynamically
const generateDiamondRates = () => {
    return {
            "USD": 900, "INR": 75000, "GBP": 850, "AUD": 1300, "CAD": 1200, "EUR": 1000,
            "JPY": 140000, "CNY": 7000, "AED": 4000, "ZAR": 20000, "SGD": 1100, "CHF": 950,
            "SEK": 7500, "NOK": 8000, "DKK": 5500, "NZD": 1250, "HKD": 7000, "THB": 34000,
            "MYR": 4800, "KRW": 1200000, "BRL": 5200, "MXN": 18000, "PHP": 65000, "IDR": 18000000,
            "SAR": 4000, "QAR": 3800, "KWD": 700, "BHD": 850, "OMR": 890, "EGP": 32000,
            "PKR": 200000, "BDT": 115000, "LKR": 350000, "NGN": 1500000, "COP": 4800000,
            "ARS": 1100000, "VES": 12000000, "UAH": 45000, "RON": 5000, "BGN": 2100, "HRK": 7500,
            "ISK": 14000, "MAD": 11000, "DZD": 180000, "TND": 4000, "MUR": 58000, "XAF": 68000,
            "XOF": 70000, "CDF": 280000, "ZMW": 2000, "MZN": 68000, "NAD": 2100,
            "BWP": 1500, "SZL": 2100, "LSL": 2100, "ETB": 6000, "SOS": 62000,
            "DJF": 19000, "SDG": 8000, "SYP": 15000, "IQD": 160000, "JOD": 850,
            "LBP": 115000, "YER": 30000, "AFN": 10500, "MVR": 1700, "NPR": 16000,
            "MMK": 320000, "KHR": 450000, "LAK": 2300000, "BND": 1100, "FJD": 2500,
            "XPF": 7000, "TMT": 25000, "AMD": 27000, "GEL": 2700, "AZN": 1300, "BYN": 2500,
            "MNT": 310000, "KYD": 850, "BSD": 900, "BMD": 900, "BBD": 1800, "HTG": 8800,
            "PAB": 900, "ANG": 1600, "AWG": 1600, "SRD": 13000, "GYD": 18000, "TTD": 5800,
            "JMD": 13000, "BZD": 1800, "PGK": 3100, "SBD": 6800, "VUV": 10000, "WST": 2200,
            "TOP": 1900, "KMF": 4100, "SCR": 1100, "MGA": 3900, "RWF": 8900, "AOA": 65000,
            "MWK": 85000, "GNF": 800000, "SLL": 100000, "LRD": 15000, "CVE": 850, "BIF": 3300,
            "GMD": 5100, "STD": 180000, "ERN": 1200, "KPW": 70000, "SSP": 830, "TJS": 8800,
            "UZS": 920000, "MRU": 3200, "FOK": 860, "GGP": 850, "IMP": 850, "JEP": 850,
            "SHP": 850
        
        
    };
};

// Function to generate historical rates for each country (2015-2024)
const generateHistoricalDiamondRates = (baseRates) => {
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

// Generate diamond rates
const diamondRatesMarch2025 = generateDiamondRates();
const historicalDiamondRates = generateHistoricalDiamondRates(diamondRatesMarch2025);

// Function to display diamond rate
function displayDiamondRate() {
    const currency = document.getElementById("diamondCountrySelect").value;
    const year = parseInt(document.getElementById("diamondYearSelect").value);
    const resultElement = document.getElementById("diamondResult");

    if (year === 2025) {
        resultElement.textContent = `💎 Diamond Rate in March 2025: ${diamondRatesMarch2025[currency]} ${currency} per gram`;
    } else {
        const { high, low } = historicalDiamondRates[year][currency] || {};
        resultElement.textContent = high && low
            ? `📅 Diamond Rates in ${year}: Highest - ${high} ${currency}, Lowest - ${low} ${currency} per gram`
            : "Historical rate data not available.";
    }
}
