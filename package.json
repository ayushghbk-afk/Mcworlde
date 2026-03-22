const API = "http://localhost:3000";

async function uploadWorld(file) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(API + "/upload", {
        method: "POST",
        body: form
    });

    const data = await res.json();
    return data.worldPath;
}

async function getChunks(path) {
    const res = await fetch(`${API}/chunks?worldPath=${path}`);
    return await res.json();
}
