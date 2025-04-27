document.addEventListener("DOMContentLoaded", async () => {
  const goldCountrySelect = document.getElementById("goldCountrySelect");
  const goldYearSelect = document.getElementById("goldYearSelect");

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
      goldCountrySelect.appendChild(option);
    });

    goldCountrySelect.value = "INR";

    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 10; year <= currentYear; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      goldYearSelect.appendChild(option);
    }

    goldYearSelect.value = currentYear;
  } catch (error) {
    console.error("Error fetching country data:", error);
  }
});

async function fetchGoldRateForCurrencyAndYear(currency, year) {
  const API_KEY = "AIzaSyBQ_ceNBKDBg1_zHzG0uWhACcsPt-h2OIE";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  let prompt = "";

  if (year === 2025) {
    prompt = `
        For currency "${currency}" give me the estimated gold price per gram in March 2025.
        Assume base gold price is 90 USD.
        Return strictly JSON format:
        {
          "currency": "INR",
          "year": 2025,
          "price": 8885
        }
        No explanation, no extra text.
      `;
  } else {
    prompt = `
        For currency "${currency}" in year "${year}",
        assume base gold price globally ~90 USD.
        Simulate:
        - highest price = base * (1.1 to 1.3)
        - lowest price = base * (0.7 to 0.9)
        Return strictly JSON format:
        {
          "currency": "INR",
          "year": 2023,
          "high": 9300,
          "low": 8600
        }
        No explanation, no extra text.
      `;
  }

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
    console.error("Error fetching Gold rate from Gemini:", error);
    return null;
  }
}

async function displayGoldRate() {
  const currency = document.getElementById("goldCountrySelect").value;
  const year = parseInt(document.getElementById("goldYearSelect").value);
  const resultElement = document.getElementById("goldResult");

  resultElement.innerHTML = "<em>Loading gold price...</em>";

  const goldData = await fetchGoldRateForCurrencyAndYear(currency, year);

  if (!goldData) {
    resultElement.innerHTML = "<strong>Error fetching gold rate.</strong>";
    return;
  }

  if (goldData.price) {
    const today = new Date();
    const monthName = today.toLocaleString("default", { month: "long" });
    const yearNow = today.getFullYear();
    resultElement.innerHTML = `🔶 <strong>Gold Rate in ${monthName} ${yearNow}:</strong> ${goldData.price} <strong>${currency} per gram</strong>`;
  } else if (goldData.high && goldData.low) {
    resultElement.innerHTML = `
        📅 <strong>Gold Rates in ${year}:</strong><br>
        <strong>Highest - ${goldData.high} ${currency}</strong><br>
        <strong>Lowest - ${goldData.low} ${currency} per gram</strong>
      `;
  } else {
    resultElement.innerHTML = "<strong>Data not available.</strong>";
  }
}
