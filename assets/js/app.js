(function () {
  const DATA_PATH = "./taps.json";
  const PLACEHOLDER_IMAGE = "assets/images/placeholder.jpg";

  const isTapPage = !!document.getElementById("tap-screen");
  const isIndexPage = !!document.getElementById("tap-list");

  async function fetchTapData() {
    const response = await fetch(DATA_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Nao foi possivel carregar os dados.");
    }

    const payload = await response.json();
    if (!payload || !Array.isArray(payload.taps)) {
      throw new Error("Formato invalido de dados.");
    }

    return payload.taps;
  }

  function toTapModel(tap) {
    return {
      id: Number(tap.id),
      name: tap.name || "Sem nome",
      style: tap.style || "Estilo nao informado",
      abv: tap.abv || "--",
      ibu: tap.ibu != null ? tap.ibu : "--",
      description: tap.description || "Sem descricao.",
      image: tap.image || PLACEHOLDER_IMAGE,
      status: tap.status || "",
    };
  }

  function setImageWithFallback(imgElement, imagePath, label) {
    imgElement.src = imagePath || PLACEHOLDER_IMAGE;
    imgElement.alt = label;
    imgElement.onerror = function () {
      this.onerror = null;
      this.src = PLACEHOLDER_IMAGE;
    };
  }

  function setStateMessage(element, message) {
    element.textContent = message;
    element.classList.remove("hidden");
  }

  async function renderTapPage() {
    const stateBox = document.getElementById("tap-state");
    const tapContent = document.getElementById("tap-content");
    const params = new URLSearchParams(window.location.search);
    const rawId = params.get("id");
    const parsedId = Number(rawId);

    if (!rawId || Number.isNaN(parsedId)) {
      setStateMessage(stateBox, "Torneira nao encontrada.");
      return;
    }

    try {
      const taps = await fetchTapData();
      const tap = taps.map(toTapModel).find((item) => item.id === parsedId);

      if (!tap) {
        setStateMessage(stateBox, "Torneira nao encontrada.");
        return;
      }

      document.getElementById("tap-name").textContent = tap.name;
      document.getElementById("tap-style").textContent = tap.style;
      document.getElementById("tap-abv").textContent = "ABV " + tap.abv;
      document.getElementById("tap-ibu").textContent = "IBU " + tap.ibu;
      document.getElementById("tap-description").textContent = tap.description;

      const statusElement = document.getElementById("tap-status");
      if (tap.status) {
        statusElement.textContent = tap.status;
        statusElement.classList.remove("hidden");
      } else {
        statusElement.classList.add("hidden");
      }

      setImageWithFallback(document.getElementById("tap-image"), tap.image, tap.name);

      document.title = "Tap Display | " + tap.name;
      tapContent.classList.remove("hidden");
      stateBox.classList.add("hidden");
    } catch (error) {
      setStateMessage(stateBox, "Erro ao carregar dados.");
    }
  }

  function buildTapCard(tap) {
    const card = document.createElement("article");
    card.className = "tap-list-card";

    const image = document.createElement("img");
    setImageWithFallback(image, tap.image, tap.name);
    image.loading = "lazy";

    const content = document.createElement("div");
    content.className = "tap-list-content";

    const name = document.createElement("h2");
    name.className = "tap-list-name";
    name.textContent = tap.name;

    const style = document.createElement("p");
    style.className = "tap-list-style";
    style.textContent = tap.style;

    const metrics = document.createElement("p");
    metrics.className = "tap-list-metrics";
    metrics.textContent = "ABV " + tap.abv + " | IBU " + tap.ibu;

    content.appendChild(name);
    content.appendChild(style);
    content.appendChild(metrics);
    card.appendChild(image);
    card.appendChild(content);

    const link = document.createElement("a");
    link.href = "tap.html?id=" + tap.id;
    link.className = "tap-link";
    link.setAttribute("aria-label", "Abrir torneira " + tap.name);
    link.appendChild(card);

    return link;
  }

  async function renderIndexPage() {
    const listElement = document.getElementById("tap-list");
    const stateBox = document.getElementById("index-state");

    try {
      const taps = (await fetchTapData()).map(toTapModel);

      if (taps.length === 0) {
        setStateMessage(stateBox, "Nenhuma torneira cadastrada.");
        return;
      }

      const fragment = document.createDocumentFragment();
      taps.forEach(function (tap) {
        fragment.appendChild(buildTapCard(tap));
      });

      listElement.innerHTML = "";
      listElement.appendChild(fragment);
      stateBox.classList.add("hidden");
    } catch (error) {
      setStateMessage(stateBox, "Erro ao carregar dados.");
    }
  }

  if (isTapPage) {
    renderTapPage();
  }

  if (isIndexPage) {
    renderIndexPage();
  }
})();
