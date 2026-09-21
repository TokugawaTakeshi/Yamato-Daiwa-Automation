const ProjectBuildingCommonSettings__Default: Readonly<{

  processingOnDemand: Readonly<{
    enabled: boolean;
    fullInitialBuilding: boolean;
  }>;

  CSS_ClassesMinificationOnFly: Readonly<{
    generatingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets: Readonly<{
      enabled: boolean;
    }>;
  }>;

}> = {

  processingOnDemand: {
    enabled: false,
    fullInitialBuilding: false
  },

  CSS_ClassesMinificationOnFly: {
    generatingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets: {
      enabled: false
    }
  }

};


export default ProjectBuildingCommonSettings__Default;
