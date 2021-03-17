import { ReactChild, ReactChildren, useEffect, useState } from "react";

const ClientOnly = ({ children }: { children: ReactChild | ReactChildren }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return <>{children}</>;
};

export default ClientOnly;
