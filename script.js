const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.smeltsertechnologies.fishingplanetguide";

document.querySelectorAll("[data-download]").forEach((link) => {
  link.href = PLAY_STORE_URL;
});

const SHARE_TEXT =
  "Free Fishing Planet companion guide for Android with hotspot coordinates, complete setups, and interactive level 1-105 routes. Available on Google Play.";

const shareButton = document.querySelector("#share-guide");
const copyButton = document.querySelector("#copy-guide-link");
const shareStatus = document.querySelector("#share-status");

const setShareStatus = (message) => {
  if (!shareStatus) return;
  shareStatus.textContent = message;
  window.setTimeout(() => {
    if (shareStatus.textContent === message) shareStatus.textContent = "";
  }, 4000);
};

const copyGuideLink = async () => {
  try {
    await navigator.clipboard.writeText(PLAY_STORE_URL);
    setShareStatus("Google Play link copied — paste it anywhere you want to share the guide.");
  } catch {
    window.prompt("Copy this Google Play link:", PLAY_STORE_URL);
  }
};

shareButton?.addEventListener("click", async () => {
  if (!navigator.share) {
    await copyGuideLink();
    return;
  }

  try {
    await navigator.share({
      title: "Fishing Planet Guide",
      text: SHARE_TEXT,
      url: PLAY_STORE_URL,
    });
  } catch (error) {
    if (error?.name !== "AbortError") setShareStatus("Sharing did not open. Use Copy link instead.");
  }
});

copyButton?.addEventListener("click", copyGuideLink);
