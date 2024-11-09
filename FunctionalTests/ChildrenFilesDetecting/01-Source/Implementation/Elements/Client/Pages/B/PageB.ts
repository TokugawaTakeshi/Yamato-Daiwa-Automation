import MainLayout from "@Layouts/Main/MainLayout";
import PageB_Partial from "./Partials/PageB-Partial";
import { Logger } from "@yamato-daiwa/es-extensions";


MainLayout.initialize();
PageB_Partial.initialize();

Logger.logInfo({
  title: "Page B",
  description: "Everything is fine"
});
