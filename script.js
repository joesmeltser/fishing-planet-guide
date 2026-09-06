const FALLBACK_RELEASE_URL =
  "https://github.com/joesmeltser/fishing-planet-guide/releases/latest";

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const updateLatestRelease = async () => {
  const downloadLinks = document.querySelectorAll("[data-download]");
  const releaseMeta = document.querySelector("#release-meta");

  try {
    const response = await fetch(
      "https://api.github.com/repos/joesmeltser/fishing-planet-guide/releases/latest",
      { headers: { Accept: "application/vnd.github+json" } },
    );

    if (!response.ok) throw new Error("Latest release could not be loaded");

    const release = await response.json();
    const apk = release.assets?.find((asset) => asset.name.toLowerCase().endsWith(".apk"));
    const url = apk?.browser_download_url || release.html_url || FALLBACK_RELEASE_URL;

    downloadLinks.forEach((link) => {
      link.href = url;
    });

    if (releaseMeta) {
      const downloadCount = Number.isFinite(apk?.download_count)
        ? `${apk.download_count.toLocaleString()} downloads`
        : "";
      const details = [
        release.tag_name,
        "Android ARM64",
        formatBytes(apk?.size),
        downloadCount,
        "Free",
      ].filter(Boolean);
      releaseMeta.textContent = details.join(" · ");
    }
  } catch {
    downloadLinks.forEach((link) => {
      link.href = FALLBACK_RELEASE_URL;
    });
  }
};

updateLatestRelease();

const GUIDE_URL = "https://joesmeltser.github.io/fishing-planet-guide/";
const SHARE_TEXT =
  "Free Fishing Planet companion guide for Android: fish, locations, bait, tackle, hotspots, competitions, and tournaments.";

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
    await navigator.clipboard.writeText(GUIDE_URL);
    setShareStatus("Link copied — paste it anywhere you want to share the guide.");
  } catch {
    window.prompt("Copy this link:", GUIDE_URL);
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
      url: GUIDE_URL,
    });
  } catch (error) {
    if (error?.name !== "AbortError") setShareStatus("Sharing did not open. Use Copy link instead.");
  }
});

copyButton?.addEventListener("click", copyGuideLink);
