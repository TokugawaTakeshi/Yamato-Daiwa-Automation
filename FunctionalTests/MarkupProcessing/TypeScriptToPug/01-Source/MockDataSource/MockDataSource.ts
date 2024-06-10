/* --- Enterprise business rules ------------------------------------------------------------------------------------ */
import type Product from "../Entities/Product";
import type Category from "../Entities/Category";

/* --- Data --------------------------------------------------------------------------------------------------------- */
import ProductsCollectionsMocker from "./Collections/ProductsCollectionsMocker";
import CategoriesCollectionsMocker from "./Collections/CategoriesCollectionsMocker";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import { DataMocking, Logger } from "@yamato-daiwa/es-extensions";


export default class MockDataSource {

  /* === Data ======================================================================================================= */
  public readonly categories: Array<Category> = [];
  public readonly products: Array<Product> = [];


  /* === Initialization ============================================================================================= */
  private static selfSoleInstance: MockDataSource | null = null;

  public static getInstance(): MockDataSource {

    if (MockDataSource.selfSoleInstance === null) {

      MockDataSource.selfSoleInstance = new MockDataSource();

      Logger.logSuccess({
        title: "Mock data source initialization complete",
        description: "Mock data source has been initialized. This feature must not be in production mode."
      });

    }


    return MockDataSource.selfSoleInstance;

  }

  private constructor() {

    this.categories = CategoriesCollectionsMocker.generate([
      {
        withNames: [
          "Beverages",
          "Salads",
          "Fish",
          "Meat",
          "Vegetarian",
          "Bread",
          "Milk products",
          "High calories",
          "Dessert"
        ]
      },
      {
        nameInfixForSearchingImitation: "-SEARCHING_TEST-",
        quantity: 3
      },
      {
        completelyRandom: true,
        quantity: 2
      }
    ]);

    this.products = ProductsCollectionsMocker.generate({
      mockingOrder: [
        {
          nameInfixForSearchingImitation: "テスト",
          optionalPropertiesDecisionStrategy: DataMocking.OptionalPropertiesDecisionStrategies.
              mustGenerateWith50PercentageProbability,
          quantity: 5
        },
        {
          completelyRandom: true,
          optionalPropertiesDecisionStrategy: DataMocking.OptionalPropertiesDecisionStrategies.mustGenerateAll,
          quantity: 5
        },
        {
          completelyRandom: true,
          optionalPropertiesDecisionStrategy: DataMocking.OptionalPropertiesDecisionStrategies.mustSkipIfHasNotBeenPreDefined,
          quantity: 5
        }
      ],
      dependencies: {
        categories: this.categories
      }
    });

  }

}
