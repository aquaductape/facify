export const doesImageExist = (url: string) =>
  new Promise<boolean>((resolve) => {
    const img = new Image();

    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
