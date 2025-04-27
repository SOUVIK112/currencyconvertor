document.addEventListener("DOMContentLoaded", async () => {
    const silverCountrySelect = document.getElementById("silverCountrySelect");
    const silverYearSelect = document.getElementById("silverYearSelect");

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

                return {
                    name: country.name.common,
                    code: code,
                    flag: flag
                };
            })
            .filter((c) => c.code)
            .sort((a, b) => a.name.localeCompare(b.name));

        countries.forEach((cur) => {
            const option = document.createElement("option");
            option.value = cur.code;
            option.textContent = `${cur.flag} ${cur.name} (${cur.code})`;
            silverCountrySelect.appendChild(option);
        });

        silverCountrySelect.value = "INR";

        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 10; year <= currentYear; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            silverYearSelect.appendChild(option);
        }

        silverYearSelect.value = currentYear;
    } catch (error) {
        console.error("Error fetching country data:", error);
    }
});

const generateSilverRates = () => {
    return {
        "USD": 1.32, "INR": 110, "GBP": 1.03, "AUD": 2.05, "CAD": 1.80, "EUR": 1.22,
        "JPY": 190, "CNY": 9.5, "AED": 4.85, "ZAR": 26.5, "SGD": 1.72, "CHF": 1.25,
        "SEK": 11.5, "NOK": 12, "DKK": 8.1, "NZD": 2.10, "HKD": 10.1, "THB": 47.5,
        "MYR": 7.10, "KRW": 1750, "BRL": 7.90, "MXN": 25.50, "PHP": 86.2, "IDR": 24800,
        "SAR": 5.10, "QAR": 4.90, "KWD": 0.94, "BHD": 1.18, "OMR": 1.20, "EGP": 4600,
        "PKR": 285, "BDT": 165, "LKR": 475, "NGN": 2050, "COP": 6450, "ARS": 1475,
        "VES": 16050, "UAH": 5900, "RON": 710, "BGN": 280, "HRK": 1030, "ISK": 1870,
        "MAD": 1550, "DZD": 2350, "TND": 540, "MUR": 7650, "XAF": 9350, "XOF": 9500,
        "CDF": 3750, "ZMW": 275, "MZN": 9300, "NAD": 285, "BWP": 208, "SZL": 285,
        "LSL": 285, "ETB": 835, "SOS": 8500, "DJF": 2650, "SDG": 1075, "SYP": 2050,
        "IQD": 2270, "JOD": 1.13, "LBP": 1570, "YER": 415, "AFN": 144, "MVR": 236,
        "NPR": 214, "MMK": 435, "KHR": 595, "LAK": 3150, "BND": 168, "FJD": 355,
        "XPF": 1670, "TMT": 545, "AMD": 590, "GEL": 560, "AZN": 255, "BYN": 460,
        "MNT": 575, "KYD": 158, "BSD": 1.32, "BMD": 1.32, "BBD": 2.64, "HTG": 145,
        "PAB": 1.32, "ANG": 2.40, "AWG": 2.50, "SRD": 22.5, "GYD": 307, "TTD": 9.75,
        "JMD": 225, "BZD": 2.64, "PGK": 535, "SBD": 1170, "VUV": 1750, "WST": 400,
        "TOP": 360, "KMF": 740, "SCR": 205, "MGA": 6900, "RWF": 1570, "AOA": 12350
    };
};

const generateHistoricalSilverRates = (baseRates) => {
    const historicalRates = {};

    for (let year = 2015; year <= 2024; year++) {
        historicalRates[year] = {};

        Object.keys(baseRates).forEach((currency) => {
            const rate = baseRates[currency];
            historicalRates[year][currency] = {
                high: Math.round(rate * (1.2 + Math.random() * 0.2)),
                low: Math.round(rate * (0.8 - Math.random() * 0.2)),
            };
        });
    }

    return historicalRates;
};

const silverRatesMarch2025 = generateSilverRates();
const historicalSilverRates = generateHistoricalSilverRates(silverRatesMarch2025);

function displaySilverRate() {
    const currency = document.getElementById("silverCountrySelect").value;
    const year = parseInt(document.getElementById("silverYearSelect").value);
    const resultElement = document.getElementById("silverResult");

   /* if (year === 2025) {
        resultElement.textContent = `🥈 Silver Price in March 2025: ${silverRatesMarch2025[currency]} ${currency} per gram`;
    } else {
        const { high, low } = historicalSilverRates[year][currency] || {};
        resultElement.textContent = high && low
            ? `📅Silver Prices in ${year}: Highest - ${high} ${currency}, Lowest - ${low} ${currency} per gram`
            : "Historical rate data not available.";
    }  */
            if (year === 2025) {  
                resultElement.innerHTML = `🥈 <strong>Silver Price in March 2025:</strong> ${silverRatesMarch2025[currency]} <strong>${currency} per gram</strong>`;  
            } else {  
                const { high, low } = historicalSilverRates[year][currency] || {};  
                resultElement.innerHTML = high && low  
                    ? `📅 <strong>Silver Prices in ${year}: Highest - ${high} ${currency}, Lowest - ${low} ${currency} per gram</strong>`  
                    : "<strong>Historical rate data not available.</strong>";  
            }
            
}
