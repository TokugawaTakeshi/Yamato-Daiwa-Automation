# Импорт скомпилированного TypeScript-кода в Pug

На первый взгляд, эта концепция может показаться абсурдной, однако она появилась не от обилия времени у разработчиков, 
а от конкретной потребности.

На этапе **статического превью**, когда написание логики приложения ещё не началось, уже возникает потребность в 
данных, пускай и случайно сгенерированных. Например, верстая страницу списка товаров, нам нужно показать заполненный
список, чтобы заказчик мог посмотреть, как это в будущем будет выглядеть и при необходимости - изменить дизайн.
Но, где взять данные товаров на этапе **статического превью**?

Первый и самый примитивный вариант - просто сверстать много карточек с вручную вписанными названиями, ценами и т. д.:

```jade
ul.ProductsList
  
  li.ProuductCard

    a.ProuductCard-LinkWrapper(href="#")
    
      img.ProuductCard-Thumbnail(
        src="@DummyImages/Products/Product1"
        alt="The product's photo"
      )
    
      span.ProductCard-Title Product 1
      
      span.ProductCard-PriceLabel
        span.ProductCard-PriceLabel-Amount 30
        span.ProductCard-PriceLabel-Currency $
      

  li.ProuductCard

    a.ProuductCard-LinkWrapper(href="#")

      img.ProuductCard-Thumbnail(
        src="@DummyImages/Products/Product2"
        alt="The product's photo"
      )

      span.ProductCard-Title Product 2

      span.ProductCard-PriceLabel
        span.ProductCard-PriceLabel-Amount 50
        span.ProductCard-PriceLabel-Currency $
```

И так ещё 10-20 карточек. Долго, рутинно, скучно. 
Особенно, если понадобится внести изменения в разметку карточки - придётся менять код всех карточек.
Люди, которые пишут такой код, игнорируют мощную функциональность препроцессора Pug, а потом задают глупые вопросы
наподобие "Зачем нужен Pug когда есть Emmet?" (и правда, зачем кухонный комбайн, когда есть ложка?)


Пользуясь функциональностью пре-процессора Pug, мы можем писать JavaScript (жаль что не TypeScript) код прямо в посреди
разметки. Таким образом, можно создать массив с данными и потом использовать итеративный рендеринг:

```jade
-

  const products = [
    { title: "Mug cup", price: 10, photoURI: "@DummyImages/Products/MugCup" },        
    { title: "Wine glass", price: 20, photoURI: "@DummyImages/Products/WineGlass" },
    Array.from(new Array(10).keys()).map(index => ({
      title: `Product ${ index + 1 }`,
      price: 10 * (index + 1),
      photoURI: `@DummyImages/Products/Product${ index + 1 }`
    }))
  ];

  
ul.ProductsList

  each product in products
    
    li.ProuductCard
  
      a.ProuductCard-LinkWrapper(href="#")
  
        img.ProuductCard-Thumbnail(
          src= product.photoURI
          alt= `The photo of the product ${ product.title }`
        )
  
        span.ProductCard-Title= product.title
  
        span.ProductCard-PriceLabel
          span.ProductCard-PriceLabel-Amount= product.price
          span.ProductCard-PriceLabel-Currency $
```

Пользователи библиотеки [@yamato-daiwa/frontend](https://github.com/TokugawaTakeshi/Yamato-Daiwa-Frontend/blob/master/CoreLibrary/Package/README.md)
могут даже воспользоваться генераторами случайных значений, поскольку данная библиотека предоставляет доступ к большей
части функциональности [@yamato-daiwa/es-extensions](https://github.com/TokugawaTakeshi/Yamato-Daiwa-ES-Extensions/blob/master/CoreLibrary/Package/README.md)
прямо внутри Pug:

```jade
-

  const products = [
    { title: "Mug cup", price: 10, photoURI: "@DummyImages/Products/MugCup" },        
    { title: "Wine glass", price: 20, photoURI: "@DummyImages/Products/WineGlass" },
    Array.from(new Array(10).keys()).map(index => ({
      title: getRandomString({ minimalCharactersCount: 2, maximalCharactersCount: 117 }),
      price: getRandomInteger({ minimalValue: 10, maximalValue: 1000 }),
      photoURI: getRandomObjectPropertyValue(DummyImagesURIs)
    }))
  ];
```

Конечно, названия товаров получатся бессмысленные (просто комбинация символов), но для статического превью достаточно
нескольких осмысленных названий.


Хорошо, но можно ли пойти ещё дальше?
Хотя на этапе **статического превью** о написании логики ещё речи не идёт, **мокинг данных** - это процесс, которому
всё равно рекомендуется уделить внимание на дальнейших этапах разработки. 

> Вы не должны испытывать потребности в подключении к базе данных для выполнения тестов. 
> Ваши сущности должны быть самыми обычными объектами, не зависящими от фреймворков, баз данных или чего-то другого. 
> Ваши объекты вариантов использования должны координировать действия сущностей. 
> Наконец, должна иметься возможность протестировать их вместе без привлечения любых фреймворков.
> 
> Чистая архитектура - искусство разработки программного обеспечения - Роберт Мартин

Для такого тестирования как раз понадобятся тестовые данные.

Написание кода генерации тестовых данных хотя и требует определённого времени, но с точки зрения это довольно простая
работа, которую можно делегировать начинающим программистом (в отличии от вёрстки, которая вопреки стереотипу отнюдь
непростая, если речь идёт о написании качественного кода с учётом поисковой оптимизации и доступности).
Таким образом, можно распараллелить создание **статического превью** и реализацию **мокинга данных** уже с использованием
языка TypeScript и улучшенных генераторов хоть и случайных, но осмысленных данных 
(например [@faker-js/faker](https://fakerjs.dev/guide/) - не путать со скандальной [faker](https://www.npmjs.com/package/faker)).

TypeScript-файл, готовящий данные для статического превью может быть максимально простым и выглядеть примерно так: 

```typescript
import type Category from "@EnterpriseBusinessRules/Category";
import type Product from "@EnterpriseBusinessRules/Product";

import MockDataSource from "@MockDataSource/MockDataSource";


const mockDataSource: MockDataSource = MockDataSource.getInstance();

const MockData: {
  categories: ReadonlyArray<Category>;
  products: ReadonlyArray<Product>
} = {
  categories: mockDataSource.categories,
  products: mockDataSource.products
};


export default MockData;
```

Реализация `MockDataSource` уже сложнее, но она и использоваться будет не только для статического превью, но и в дальнейшем,
поэтому инвестиции в создание этого класса правильные. [Полную реализацию примера `MockDataSource`](https://github.com/TokugawaTakeshi/Yamato-Daiwa-Backend/blob/master/SampleWebApplication/01-Source/Infrastructure/Elements/MockDataSource/MockDataSource.ts) 
можно посмотреть в демо клиент-серверного приложения в репозитории фреймворка [Yamato Daiwa Backend](https://github.com/TokugawaTakeshi/Yamato-Daiwa-Backend).

Осталась одна "мелочь": скомпилировать этот код в JavaScript, причём так, чтобы не было никаких `import`, `export` и 
`require`, и затем сохранить его в Pug-файл, причём обернув литералом `-` внутреннего (по отношению Pug) JavaScript кода.
Кто-то скажет, то это невозможно, но с Webpack-ом основная проблема - замена CommonJS и ES-модулей на понятные для любого
JavaScript-рантайма UMD - может быть решена. Разумеется, тут есть свои подводные камни, но тем не менее задача импорта
компилированного TypeScript-кода в YDA была решена.

Итак, что делает YDA?

1. Компилирует в JavaScript указанный в настройках TypeScript-файл.
2. Превращает выходной JavaScript-файл в Pug-файл, добавляя литерал внутреннего JavaScript-кода, а также сохраняет
   в указанную в настройках переменную (например `DummyData` экспорт по умолчанию).

Теперь переменная `DummyData` становится доступна, если подключить откомпилированный файл к нужной точке входа.
Заметим, что этот процесс будет завершен раньше, чем начнётся компиляция разметки в HTML, иначе Pug-файл с данными просто 
не будет готов. Но это абсолютно не страшно, так как компиляция разметки и так всега выполняется в последнюю очередь.
