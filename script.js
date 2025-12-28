const sections = {
    posts: [
        "alive.txt",
        "day-zero.txt",
    ],
    poems: [
        "signal.txt"
    ]
};

const list = document.getElementById("list");
const content = document.getElementById("content");

function showSection(section) {
    list.innerHTML = "";
    content.innerHTML = `<p class="hint">select an entry</p>`;

    const total = sections[section].length;

    sections[section].forEach((filename, index) => {
        const tab = document.createElement("div");
        tab.className = "tab";

        // numbering: newest gets highest number
        const number = String(total - index).padStart(2, "0");
        const title = filename.replace(".txt", "").replace(/-/g, " ");

        tab.textContent = `${number}  ${title}`;

        tab.onclick = async () => {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            await loadFile(section, filename);
        };

        list.appendChild(tab);
    });
}


async function loadFile(section, filename) {
    const res = await fetch(`content/${section}/${filename}`);
    const text = await res.text();

    const lines = text.split("\n");
    const titleLine = lines.find(l => l.startsWith("#"));
    const body = lines.slice(lines.indexOf(titleLine) + 1).join("\n");

    content.innerHTML = `
        <h2>${titleLine.replace("#", "").trim()}</h2>
        <pre>${parse(body)}</pre>
    `;
}

/* ---------- WRITING ENGINE ---------- */
function parse(text) {
    return text
        // alignment blocks
        .replace(/\[left\]([\s\S]*?)\[\/left\]/g, `<div class="align-left">$1</div>`)
        .replace(/\[center\]([\s\S]*?)\[\/center\]/g, `<div class="align-center">$1</div>`)
        .replace(/\[right\]([\s\S]*?)\[\/right\]/g, `<div class="align-right">$1</div>`)

        // inline effects
        .replace(/\[color:(.*?)\](.*?)\[\/color\]/gs, `<span class="c-$1">$2</span>`)
        .replace(/\[rainbow\](.*?)\[\/rainbow\]/gs, `<span class="rainbow">$1</span>`)
        .replace(/\[bounce\](.*?)\[\/bounce\]/gs, `<span class="bounce">$1</span>`);
}


// default
showSection("posts");
