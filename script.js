const CORS_PROXY = "https://api.allorigins.win/raw?url=";

const paths = [
    "/robots.txt", "/sitemap.xml", "/admin", "/login",
    "/dashboard", "/backup", "/config", "/.env",
    "/api", "/uploads", "/images", "/css", "/js",
    "/secret", "/private", "/test", "/dev",
];
async function checkPath(base, path) {
    try {
        const response = await fetch(CORS_PROXY + encodeURIComponent(base + path));
        return { path, status: response.status, found: response.ok };
    } catch {
        return { path, status: "Error", found: false };
    }
}
async function scan() {
    const input = document.getElementById("url-input").value.trim();
    if (!input) return;

    const base = input.endsWith("/") ? input.slice(0, -1) : input;

    document.getElementById("progress").classList.remove("hidden");

    document.getElementById("results").classList.remove("hidden");
    document.getElementById("result-list").innerHTML = "";
    document.getElementById("summary").innerHTML = "";

    let found = 0;

    for (let i = 0; i < paths.length; i++) {
        const result = await checkPath(base, paths[i]);

        const percent = Math.round(((i + 1) / paths.length) * 100);
        document.getElementById("progress-fill").style.width = percent + "%";
        document.getElementById("progress-text").textContent = `Scanning... ${percent}%`;

        const div = document.createElement("div");
        div.classList.add("result-item");

        if (result.found) {
            found++;
            div.classList.add("result-found");
            div.innerHTML = `
            <span class="status-badge badge-found">${result.status}</span>
            <span>${result.path}</span>
            `;
        } else {
            div.classList.add("result-not-found");
            div.innerHTML = `
            <span class="status-badge badge-not-found">404</span>
            <span>${result.path}</span>
            `;
        }
        document.getElementById("result-list").appendChild(div);
    }
    document.getElementById("progress-text").textContent = "Scan complete!";
    document.getElementById("summary").textContent = `Found: ${found} / ${paths.length} paths`;
}