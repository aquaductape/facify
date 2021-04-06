export const getBase64FromUrl = async ({
  url,
  proxy,
}: {
  url: string;
  proxy?: string;
}) => {
  if (proxy) {
    const res = await fetch(proxy, {
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
    return data as {
      base64: string;
      sizeMB: number | null;
      error: string | null;
    };
  }

  const data = await fetch(url);

  const blob = await data.blob();
  return new Promise<{
    base64: string;
    sizeMB: number | null;
    error: string | null;
  }>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result;
      resolve({ base64: base64data as string, sizeMB: null, error: null });
    };
  });
};
