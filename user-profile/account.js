const profileForm = document.getElementById("profileForm");

const nameInput = document.getElementById("nameInput");
const avatarInput = document.getElementById("avatarInput");
const bioInput = document.getElementById("bioInput");
const instagramInput = document.getElementById("instagramInput");
const githubInput = document.getElementById("githubInput");
const websiteInput = document.getElementById("websiteInput");

const displayName = document.getElementById("displayName");
const avatarPreview = document.getElementById("avatarPreview");
const displayBio = document.getElementById("displayBio");
const displayInstagram = document.getElementById("displayInstagram");
const displayGithub = document.getElementById("displayGithub");
const displayWebsite = document.getElementById("displayWebsite");

function loadProfile() {
  const savedProfile = JSON.parse(localStorage.getItem("userProfile"));

  if (savedProfile) {
    displayName.textContent = savedProfile.name || "Guest User";
    avatarPreview.src = savedProfile.avatar || "https://via.placeholder.com/120";
    displayBio.textContent = savedProfile.bio || "No bio added yet.";

    displayInstagram.href = savedProfile.instagram || "#";
    displayGithub.href = savedProfile.github || "#";
    displayWebsite.href = savedProfile.website || "#";

    nameInput.value = savedProfile.name || "";
    avatarInput.value = savedProfile.avatar || "";
    bioInput.value = savedProfile.bio || "";
    instagramInput.value = savedProfile.instagram || "";
    githubInput.value = savedProfile.github || "";
    websiteInput.value = savedProfile.website || "";
  }
}

profileForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const profile = {
    name: nameInput.value,
    avatar: avatarInput.value,
    bio: bioInput.value,
    instagram: instagramInput.value,
    github: githubInput.value,
    website: websiteInput.value
  };

  localStorage.setItem("userProfile", JSON.stringify(profile));
  loadProfile();

  alert("Profile saved successfully!");
});

loadProfile();