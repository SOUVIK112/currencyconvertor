document.addEventListener("DOMContentLoaded", () => {
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");

    fetch("https://restcountries.com/v3.1/all")
        .then((res) => res.json())
        .then((data) => {
            const currencies = data
                .map((country) => {
                    const code = Object.keys(country.currencies || {})[0];
                    return {
                        name: country.name.common,
                        code: code,
                        flag: country.flag || "" // Unicode flag (like 🇺🇸)
                    };
                })
                .filter((c) => c.code)
                .sort((a, b) => a.name.localeCompare(b.name));

            currencies.forEach((cur) => {
                const option1 = document.createElement("option");
                const option2 = document.createElement("option");
                option1.value = option2.value = cur.code;
                option1.textContent = `${cur.flag} ${cur.name} (${cur.code})`;
                option2.textContent = `${cur.flag} ${cur.name} (${cur.code})`;
                fromCurrency.appendChild(option1);
                toCurrency.appendChild(option2);
            });

            fromCurrency.value = "INR";
            toCurrency.value = "USD";
        })
        .catch((error) => console.error("Error fetching country data:", error));
});

// Convert Currency Function
function convertCurrency() {
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;
    const amount = document.getElementById("amount").value;
    const resultElement = document.getElementById("result");

    if (!amount || amount <= 0) {
        resultElement.textContent = "Please enter a valid amount.";
        return;
    }

    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then((res) => res.json())
        .then((data) => {
            if (!data.rates[toCurrency]) {
                resultElement.textContent = "Conversion rate not available.";
                return;
            }
            const rate = data.rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);
            resultElement.textContent = `Converted Amount: ${convertedAmount} ${toCurrency}`;
        })
        .catch((error) => {
            console.error("Error fetching exchange rates:", error);
            resultElement.textContent = "Conversion failed. Try again.";
        });
}
