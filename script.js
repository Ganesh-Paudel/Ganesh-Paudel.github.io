async function loadProjects() {
  try {
    const response = await fetch("./projects.json");
    const projects = await response.json();

    const container = document.getElementById("project-container");
    container.innerHTML = "";

    projects.forEach(project => {
      const card = document.createElement("div");
      card.className = "project-card";

      const tech = project.techStack.join(", ");
      const features = project.features.map(f => `<li>${f}</li>`).join("");

      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>

        <p><strong>Tech:</strong> ${tech}</p>
        <p><strong>Status:</strong> ${project.status}</p>

        <ul>${features}</ul>

        <a href="${project.link}" target="_blank">View Project</a>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

loadProjects();
