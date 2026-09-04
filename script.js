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
      const details = [release.tag_name, "Android ARM64", formatBytes(apk?.size), "Free"].filter(Boolean);
      releaseMeta.textContent = details.join(" · ");
    }
  } catch {
    downloadLinks.forEach((link) => {
      link.href = FALLBACK_RELEASE_URL;
    });
  }
};

updateLatestRelease();
