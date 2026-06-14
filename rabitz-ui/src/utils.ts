export function formatTime(s: number) {
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

const getBlobFromSrc = async (source: any) => {
  try {
    const response = await fetch(source);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error fetching video:", error);
    return null;
  }
};

export const send = async (source: any, destination: string) => {
  const formData = new FormData();
  const blob = await getBlobFromSrc(source);

  if (blob) {
    formData.append(
      "file",
      blob,
      `recording-${Date.now()}.webm`
    );
    console.info(blob);
  }

  fetch(destination, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })
    .then(() => {
      console.info("recording uploaded");
    })
    .catch((error) => {
      console.error("uploadError", error);
    });
};