const searchInput = document.querySelector("#example-search");
const tableBody = document.querySelector("#examples-table-body");
const exampleCount = document.querySelector("#example-count");

let examples = [];

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function matchesQuery(example, query) {
  if (!query) {
    return true;
  }

  return [
    example.name,
    example.category,
    example.version,
    example.status,
    example.description,
  ]
    .map(normalize)
    .join(" ")
    .includes(query);
}

function renderTable(items) {
  if (!items.length) {
    tableBody.innerHTML = `
      <tr>
        <td class="empty-row" colspan="4">No examples found.</td>
      </tr>
    `;
    exampleCount.textContent = "0 examples";
    return;
  }

  tableBody.innerHTML = items
    .map(
      (example) => `
        <tr>
          <td>
            <strong>${example.name}</strong>
            <small>${example.category} / ${example.status}</small>
            <small>${example.description}</small>
          </td>
          <td>
            <a class="docs-link" href="${example.previewUrl}">Open preview</a>
          </td>
          <td>
            <a class="docs-link" href="${example.sourceUrl}">Open source</a>
          </td>
          <td>${example.version}</td>
        </tr>
      `,
    )
    .join("");

  exampleCount.textContent = `${items.length} example${items.length === 1 ? "" : "s"}`;
}

function renderExamples() {
  const query = normalize(searchInput.value);
  renderTable(examples.filter((example) => matchesQuery(example, query)));
}

async function loadExamples() {
  try {
    const response = await fetch("./data/examples.json");

    if (!response.ok) {
      throw new Error(`Failed to load examples: ${response.status}`);
    }

    examples = await response.json();
    renderExamples();
  } catch (error) {
    tableBody.innerHTML = `
      <tr>
        <td class="empty-row" colspan="4">
          Failed to load examples. Use Live Server or another static server.
        </td>
      </tr>
    `;
    exampleCount.textContent = "Examples unavailable";
    console.error(error);
  }
}

searchInput.addEventListener("input", renderExamples);

loadExamples();
