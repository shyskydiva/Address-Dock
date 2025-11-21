const API_BASE_URL = "http://localhost:3001"; // SERVER_PORT

    const form = document.getElementById("search-form");
    const statusEl = document.getElementById("status");
    const table = document.getElementById("results-table");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const field = document.getElementById("field").value;
      const query = document.getElementById("query").value.trim();

      statusEl.textContent = "";
      statusEl.className = "";
      table.classList.add("hidden");
      thead.innerHTML = "";
      tbody.innerHTML = "";

      if (!query) {
        statusEl.textContent = "Please enter a search value.";
        statusEl.classList.add("error");
        return;
      }

      statusEl.textContent = "Searching…";

      try {
        const response = await fetch(`${API_BASE_URL}/address/request`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: query.toUpperCase() }), // converted to uppercase
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Server returned ${response.status}: ${text}`);
        }

        const json = await response.json();

        let items = [];

        if (Array.isArray(json.body)) {
        items = json.body;
        }


        if (!items.length) {
          statusEl.textContent = "No results found.";
          statusEl.classList.add("error");
          return;
        }

        // Build table headers from object keys
        const columns = Object.keys(items[0]);

        const headerRow = document.createElement("tr");
        columns.forEach((col) => {
          const th = document.createElement("th");
          th.textContent = col;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Build table rows
        items.forEach((item) => {
          const tr = document.createElement("tr");
          columns.forEach((col) => {
            const td = document.createElement("td");
            td.textContent =
              item[col] === null || item[col] === undefined
                ? ""
                : String(item[col]);
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });

        statusEl.textContent = `Showing ${items.length} result(s).`;
        statusEl.classList.add("success");
        table.classList.remove("hidden");
      } catch (err) {
        console.error(err);
        statusEl.textContent = "Error: " + err.message;
        statusEl.classList.add("error");
      }
    });