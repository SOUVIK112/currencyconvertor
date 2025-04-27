document.addEventListener("DOMContentLoaded", async () => {
  const diamondCountrySelect = document.getElementById("diamondCountrySelect");
  const diamondYearSelect = document.getElementById("diamondYearSelect");

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
      diamondCountrySelect.appendChild(option);
    });

    diamondCountrySelect.value = "INR";

    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 10; year <= currentYear; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      diamondYearSelect.appendChild(option);
    }

    diamondYearSelect.value = currentYear;
  } catch (error) {
    console.error("Error fetching country data:", error);
  }
});

async function fetchDiamondRateForCurrencyAndYear(currency, year) {
  const API_KEY = "AIzaSyBQ_ceNBKDBg1_zHzG0uWhACcsPt-h2OIE";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  let prompt = "";

  if (year === 2025) {
    prompt = `
          For currency "${currency}" give me the estimated diamond price per gram in March 2025.
          Assume base diamond price globally is around 900 USD per gram.
          Return JSON format:
          {
            "currency": "INR",
            "year": 2025,
            "price": 75000
          }
          No explanation, no extra text, only JSON.
        `;
  } else {
    prompt = `
          For currency "${currency}" and year "${year}",
          simulate:
          - highest diamond price = base * (1.1 to 1.3)
          - lowest diamond price = base * (0.7 to 0.9)
          (Base diamond price is about 900 USD per gram)
          Return JSON format:
          {
            "currency": "INR",
            "year": 2023,
            "high": 78000,
            "low": 69000
          }
          No explanation, only JSON.
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
    console.error("Error fetching Diamond rate from Gemini:", error);
    return null;
  }
}

async function displayDiamondRate() {
  const currency = document.getElementById("diamondCountrySelect").value;
  const year = parseInt(document.getElementById("diamondYearSelect").value);
  const resultElement = document.getElementById("diamondResult");

  resultElement.innerHTML = "<em>Loading diamond price...</em>";

  const diamondData = await fetchDiamondRateForCurrencyAndYear(currency, year);

  if (!diamondData) {
    resultElement.innerHTML = "<strong>Error fetching diamond rate.</strong>";
    return;
  }

  if (diamondData.price) {
    const today = new Date();
    const monthName = today.toLocaleString("default", { month: "long" });
    const yearNow = today.getFullYear();
    resultElement.innerHTML = `💎 <strong>Diamond Rate in ${monthName} ${yearNow}:</strong> ${diamondData.price} <strong>${currency} per gram</strong>`;
  } else if (diamondData.high && diamondData.low) {
    resultElement.innerHTML = `
            📅 <strong>Diamond Rates in ${year}:</strong><br>
            <strong>Highest - ${diamondData.high} ${currency}</strong><br>
            <strong>Lowest - ${diamondData.low} ${currency} per gram</strong>
        `;
  } else {
    resultElement.innerHTML = "<strong>Data not available.</strong>";
  }
}
