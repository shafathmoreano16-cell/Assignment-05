const usernameInput = document.getElementById("usernameInput");
const searchButton = document.getElementById("searchButton");
const message = document.getElementById("message");
const gallery = document.getElementById("gallery");

const defaultUsername = "shafathmoreano16-cell";

function formatDate(dateString) {
  const dateObject = new Date(dateString);
  return dateObject.toLocaleDateString();
}

async function getLanguages(languagesUrl) {
  try {
    const response = await fetch(languagesUrl);
    const languageData = await response.json();
    const languageNames = Object.keys(languageData);

    if (languageNames.length === 0) {
      return "None listed";
    }

    return languageNames.join(", ");
  } catch (error) {
    return "Unable to load languages";
  }
}

async function displayRepositories(username) {
  gallery.innerHTML = "";
  message.textContent = "Loading repositories...";

  const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const repos = await response.json();

    if (repos.length === 0) {
      message.textContent = "No repositories were returned for this user.";
      return;
    }

    message.textContent = `Showing latest ${repos.length} repositories for ${username}`;

    for (let i = 0; i < repos.length; i++) {
      const repo = repos[i];
      const languages = await getLanguages(repo.languages_url);

      const card = document.createElement("div");
      card.className = "repo-card";

      card.innerHTML = `
        <h2>${repo.name}</h2>
        <p><strong>Description:</strong> ${repo.description ? repo.description : "No description"}</p>
        <p><strong>Created:</strong> ${formatDate(repo.created_at)}</p>
        <p><strong>Updated:</strong> ${formatDate(repo.updated_at)}</p>
        <p><strong>Languages:</strong> ${languages}</p>
        <p><strong>Watchers:</strong> ${repo.watchers_count}</p>
        <a class="repo-link" href="${repo.html_url}" target="_blank">View Repository</a>
      `;

      gallery.appendChild(card);
    }
  } catch (error) {
    message.textContent = "Could not load repositories. Please check the username and try again.";
  }
}

searchButton.addEventListener("click", function () {
  const username = usernameInput.value.trim();

  if (username === "") {
    message.textContent = "Please enter a GitHub username.";
    gallery.innerHTML = "";
    return;
  }

  displayRepositories(username);
});

usernameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

displayRepositories(defaultUsername);