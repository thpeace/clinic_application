import Routers from "./routes";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function App() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("clinicName");
  });
  return (
    <div>
      <Routers />
    </div>
  );
}

export default App;
