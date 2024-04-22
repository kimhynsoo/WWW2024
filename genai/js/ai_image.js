document.addEventListener("DOMContentLoaded", function() {
    const inputText = document.querySelector("#questionInput");
    const aiButton = document.querySelector("#askButton");
    const imageContainer = document.querySelector("#imageContainer");

    aiButton.onclick = async function (event) {
        const text = inputText.value;
        console.log("User typed: ", text);

        const url = "https://gaib2024-oai.openai.azure.com/openai/deployments/Dalle3/images/generations?api-version=2024-02-01";

        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': 'fb1de2970b384874b9761e8445348270'
            },
            body: JSON.stringify(
                {
                    "prompt": text,
                    "n": 1,
                    "size": "1024x1024"
                }
            )
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                const imageUrl = data.data[0].url;
                const imageElement = document.createElement("img");
                imageElement.src = imageUrl;
                imageElement.classList.add("img-fluid", "mt-3");
                imageContainer.appendChild(imageElement);
                console.log("OpenAI response", data);
            });
    };
});
