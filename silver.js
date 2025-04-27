let silverRatesMarch2025 = {};
let historicalSilverRates = {};

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
          ? String.fromCodePoint(
              ...[...countryCode.toUpperCase()].map(
                (c) => 127397 + c.charCodeAt(0)
              )
            )
          : "";

        return {
          name: country.name.common,
          code: code,
          flag: flag,
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

async function fetchSilverRateForCurrencyAndYear(currency, year) {
  const API_KEY = "AIzaSyBQ_ceNBKDBg1_zHzG0uWhACcsPt-h2OIE";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const prompt = `
    For currency "${currency}" and year "${year}", 
    give me the estimated silver price per gram.
    If year is 2025, give March 2025 price.
    Otherwise, give highest and lowest price for that year.
    Format strictly as JSON:
    {
      "currency": "INR",
      "year": 2025,
      "price": 110
    }
    or for historical year:
    {
      "currency": "INR",
      "year": 2023,
      "high": 120,
      "low": 95
    }
    No explanation, no extra text, only JSON.
  `;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt.trim() }] }],
      }),
    });

    const data = await response.json();
    console.log("Gemini Raw Response:", data);

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const text = data.candidates[0].content.parts[0].text;
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);
      return parsed;
    } else {
      console.error("Unexpected Gemini response format.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Silver rate from Gemini:", error);
    return null;
  }
}

async function displaySilverRate() {
  const currency = document.getElementById("silverCountrySelect").value;
  const year = parseInt(document.getElementById("silverYearSelect").value);
  const resultElement = document.getElementById("silverResult");

  resultElement.innerHTML = "<em>Loading silver price...</em>";

  const silverData = await fetchSilverRateForCurrencyAndYear(currency, year);

  if (!silverData) {
    resultElement.innerHTML = "<strong>Error fetching silver rate.</strong>";
    return;
  }

  if (silverData.year === 2025 && silverData.price) {
    resultElement.innerHTML = `🥈 <strong>Silver Price in March 2025:</strong> ${silverData.price} <strong>${currency} per gram</strong>`;
  } else if (silverData.high && silverData.low) {
    resultElement.innerHTML = `📅 <strong>Silver Prices in ${year}:</strong> Highest - ${silverData.high} ${currency}, Lowest - ${silverData.low} ${currency} per gram`;
  } else {
    resultElement.innerHTML = "<strong>Data not available.</strong>";
  }
}
