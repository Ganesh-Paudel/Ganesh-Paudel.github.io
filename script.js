async function loadProjects() {
  try {
    const response = await fetch("./projects.json");
    const projects = await response.json();
    console.log(projects);
    const container = document.getElementById("project-container");
    container.innerHTML = "";

    projects.forEach(project => {
      const card = document.createElement("div");
      card.className = "project-card";

      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank">View Project</a>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

loadProjects();