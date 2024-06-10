import Product from "./Entities/Product";
import Category from "./Entities/Category";

import MockDataSource from "./MockDataSource/MockDataSource";


const mockDataSource: MockDataSource = MockDataSource.getInstance();


const exportsForPug: Readonly<{

  Product: typeof Product;
  Category: typeof Category;

  mockData: Readonly<{
    products: ReadonlyArray<Product>;
    categories: ReadonlyArray<Category>;
  }>;

}> = {

  Product: Product,
  Category: Category,

  mockData: {
    products: mockDataSource.products,
    categories: mockDataSource.categories
  }

};


export default exportsForPug;
