import { ProjectBuildingConfigFromFileLocalization } from "@yamato-daiwa/automation/LocalizationRequirements";


const ProjectBuildingConfigFromFileJapaneseLocalization: ProjectBuildingConfigFromFileLocalization = {

  projectBuilding: { KEY: "プロジェクト構成" },

  consumingProjectPreDefinedBuildingModes: {
    development: "開発",
    testing: "テスト",
    staging: "ステージング",
    production: "納品"
  },

  tasksIDs: {
    markupProcessing: "構造設計記法処理",
    stylesProcessing: "意匠設計記法処理",
    ECMA_ScriptLogicProcessing: "ECMAScript系挙動制御記法処理",
    imagesProcessing: "画像処理",
    fontsProcessing: "活字処理",
    audiosProcessing: "録音処理",
    videosProcessing: "動画処理",
    browserLiveReloading: "ブラウザー自動リロード"
  },

  commonSettings: {

    KEY: "一般",

    propertiesKeys: {
      selectiveExecutions: {
        SELF: "選択的実行",
        tasksAndSourceFilesSelection: "課題及びファイル組選択",
        browserLiveReloadingSetupID: "ブラウザー自動リロード設定識別子"
      },
      publicDirectoriesRelativePaths: "構成モード依存公開ディレクトリ相対パス"
    }
  },

  stylesProcessingPropertiesKeys: {
    commonSettings: {
      SELF: "一般設定",
      waitingForOtherFilesWillBeSavedPeriod__milliseconds: "ファイル保存以降他ファイル保存待機ミリ秒期間"
    },
    entryPointsGroups: {
      SELF: "入点群",
      entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath: "入点源ファイル本ディレクトリ又は単独ファイル相対パス",
      partialsRecognition: "部分ファイル判別戦略",
      entryPointsSourceFilesTopDirectoryPathCustomAliasName: "入点源ファイル本ディレクトリパスカスタムアリアス名",
      supportedBrowsersSet: "対象ブラウザー揃名",
      buildingModeDependent: {
        SELF: "構成モード関連",
        outputBaseDirectoryRelativePath: "出力本ディレクトリ相対パス",
        revisioning: "ファイル名於内容指標"
      }
    }
  }
};


export default ProjectBuildingConfigFromFileJapaneseLocalization;
