document.addEventListener("DOMContentLoaded", async () => {
    const platinumCountrySelect = document.getElementById("platinumCountrySelect");
    const platinumYearSelect = document.getElementById("platinumYearSelect");

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
            platinumCountrySelect.appendChild(option);
        });

        platinumCountrySelect.value = "INR";

        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 10; year <= currentYear; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            platinumYearSelect.appendChild(option);
        }

        platinumYearSelect.value = currentYear;
    } catch (error) {
        console.error("Error fetching country data:", error);
    }
});

const generatePlatinumRates = () => {
    return {
        "USD": 1100, "INR": 2674, "GBP": 980, "AUD": 1500, "CAD": 1400, "EUR": 1150,
        "JPY": 170000, "CNY": 8200, "AED": 4600, "ZAR": 26000, "SGD": 1250, "CHF": 1100,
        "SEK": 8700, "NOK": 9200, "DKK": 6200, "NZD": 1400, "HKD": 7700, "THB": 39000,
        "MYR": 5400, "KRW": 1350000, "BRL": 5900, "MXN": 21000, "PHP": 72000, "IDR": 21000000,
        "SAR": 4700, "QAR": 4300, "KWD": 780, "BHD": 980, "OMR": 1000, "EGP": 36000,
        "PKR": 230000, "BDT": 135000, "LKR": 380000, "NGN": 1750000, "COP": 5400000,
        "ARS": 1250000, "VES": 13500000, "UAH": 52000, "RON": 5700, "BGN": 2400, "HRK": 8200,
        "ISK": 16000, "MAD": 12500, "DZD": 200000, "TND": 5000, "MUR": 67000, "XAF": 78000,
        "XOF": 80000, "CDF": 310000, "ZMW": 2500, "MZN": 72000, "NAD": 2500,
        "BWP": 1800, "SZL": 2500, "LSL": 2500, "ETB": 7000, "SOS": 70000,
        "DJF": 21000, "SDG": 9000, "SYP": 18000, "IQD": 180000, "JOD": 980,
        "LBP": 130000, "YER": 35000, "AFN": 12000, "MVR": 1900, "NPR": 18000,
        "MMK": 350000, "KHR": 500000, "LAK": 2500000, "BND": 1250, "FJD": 2800,
        "XPF": 8000, "TMT": 28000, "AMD": 30000, "GEL": 3000, "AZN": 1500, "BYN": 2800,
        "MNT": 350000, "KYD": 980, "BSD": 1100, "BMD": 1100, "BBD": 2200, "HTG": 9500,
        "PAB": 1100, "ANG": 1800, "AWG": 1800, "SRD": 14000, "GYD": 20000, "TTD": 6500,
        "JMD": 15000, "BZD": 2200, "PGK": 3500, "SBD": 7500, "VUV": 11000, "WST": 2500,
        "TOP": 2100, "KMF": 4700, "SCR": 1300, "MGA": 4500, "RWF": 9900, "AOA": 75000,
        "MWK": 95000, "GNF": 900000, "SLL": 110000, "LRD": 17000, "CVE": 990, "BIF": 4000,
        "GMD": 5800, "STD": 200000, "ERN": 1400, "KPW": 80000, "SSP": 920, "TJS": 9500,
        "UZS": 1020000, "MRU": 3700, "FOK": 970, "GGP": 950, "IMP": 950, "JEP": 950,
        "SHP": 950
    };
};

const generateHistoricalPrices = (latestPrice) => {
    let history = {};
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 10; year < currentYear; year++) {
        const high = latestPrice + Math.floor(Math.random() * (latestPrice * 0.2));
        const low = latestPrice - Math.floor(Math.random() * (latestPrice * 0.2));
        history[year] = { high, low };
    }
    return history;
};

function displayPlatinumRate() {
    const currency = document.getElementById("platinumCountrySelect").value;
    const year = document.getElementById("platinumYearSelect").value;
    const resultElement = document.getElementById("platinumResult");

    const rates = generatePlatinumRates();
    const historicalPrices = generateHistoricalPrices(rates[currency]);
    const latestRate = rates[currency];
    
    if (year in historicalPrices) {
        resultElement.innerHTML = `<strong>🔷 Platinum Rate in  ${year} is:</strong><br> 
                                  <strong>🔼 Highest: ${historicalPrices[year].high} ${currency}</strong><br>
                                  <strong>🔽 Lowest: ${historicalPrices[year].low} ${currency}</strong>`;
    } else {
        resultElement.innerHTML = `🔷 <strong>Platinum Rate in March 2025:</strong> ${latestRate} <strong>${currency} per gram</strong>`;

    } 
} 
   
