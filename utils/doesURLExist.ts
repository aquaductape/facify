export const doesImageExist = (url: string) =>
  new Promise<boolean>((resolve) => {
    const img = new Image();

    img.referrerPolicy = "no-referrer";
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });

export const isImageURLValid = (url: string) =>
  !!url.match(/^https?:\/\/[^\s]+\/[^\s]+$/);

export const doesURLExist = async (url: string) => {
  const res = await fetch("/api/check-URL-exist", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
    }),
  });

  const data = await res.json();

  return data.exists;
};
