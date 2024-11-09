import MainLayout from "@Layouts/Main/MainLayout";
import PageA_Partial from "./Partials/PageA-Partial";
import { Logger } from "@yamato-daiwa/es-extensions";


MainLayout.initialize();
PageA_Partial.initialize();

Logger.logInfo({
  title: "Page A",
  description: "Everything is fine"
});
