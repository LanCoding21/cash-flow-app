export function isImage(filename: string) {
  const ext = filename.split(".").slice(-1)[0];

  const imgExtensions = ["jpg", "jpeg", "png"];

  return imgExtensions.includes(ext);
}
