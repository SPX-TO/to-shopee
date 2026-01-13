const input = document.getElementById("search");
const box = document.getElementById("resultados");

input.addEventListener("input", async () => {
    const q = input.value.trim();

    if (q.length < 1) {
        box.innerHTML = "";
        return;
    }

    const res = await fetch("/api/tos?q=" + encodeURIComponent(q));
    const lista = await res.json();

    box.innerHTML = "";

    lista.forEach(item => {
        box.innerHTML += `
            <div class="card-resultado">
                <div class="res-esq">
                    <span class="cidade">${item.cidade}</span>
                    <span class="codigo">${item.codigo} ${item.estado ? `(${item.estado})` : ""}</span>
                </div>

                <span class="badge badge-${item.tipo}">${item.tipo}</span>
            </div>
        `;
    });
});
