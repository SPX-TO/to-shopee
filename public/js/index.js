const input = document.getElementById("search");

input.addEventListener("input", async () => {
    const q = input.value.trim();
    const res = await fetch(`/api/tos/public/search?q=${q}`);
    const data = await res.json();

    const list = document.getElementById("results");
    list.innerHTML = "";

    data.forEach(t => {

        // 👇 Ajuste final da classe 3PL
        const tipoClass = t.tipo === "3PL" ? "t3pl" : t.tipo.toLowerCase();

        list.innerHTML += `
            <div class="result-item">
                <span class="badge ${tipoClass}">${t.tipo}</span>
                <strong>${t.cidade}</strong> — ${t.codigo}
            </div>
        `;
    });
});
