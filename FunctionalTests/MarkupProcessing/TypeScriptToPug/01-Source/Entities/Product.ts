import type Category from "./Category";


type Product = {
  readonly ID: Product.ID;
  name: string;
  description?: string;
  category: Category;
  price__dollars__excludingTax: number;
};


namespace Product {

  export type ID = string;
  export namespace ID {
    export const TYPE: StringConstructor = String;
    export const REQUIRED: boolean = true;
    export const MINIMAL_CHARACTERS_COUNT: number = 1;
  }

  export namespace Name {
    export const TYPE: StringConstructor = String;
    export const REQUIRED: boolean = true;
    export const MINIMAL_CHARACTERS_COUNT: number = 2;
    export const MAXIMAL_CHARACTERS_COUNT: number = 255;
  }

  export namespace Description {
    export const TYPE: StringConstructor = String;
    export const REQUIRED: boolean = false;
    export const MINIMAL_CHARACTERS_COUNT: number = 2;
    export const MAXIMAL_CHARACTERS_COUNT: number = 500;
  }

  /* eslint-disable-next-line @typescript-eslint/no-shadow --
   * The declaring of type/interface inside namespace with same name as defined in upper scope
   * is completely valid TypeScript and not desired to be warned by @typescript-eslint. */
  export namespace Category {
    export const TYPE: ObjectConstructor = Object;
    export const REQUIRED: boolean = true;
  }

  export namespace Price__Dollars__IncludingTax {
    export const TYPE: NumberConstructor = Number;
    export const REQUIRED: boolean = true;
    export const MINIMAL_VALUE: number = 1;
    export const MAXIMAL_VALUE: number = Number.MAX_SAFE_INTEGER;
  }

}


export default Product;
