# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
- src/components/base/OrderPresenter.ts — презентер для оформления заказа

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура проекта

### Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS-компонентами
- src/components/base/ — папка с базовым кодом

**Важные файлы:**

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

### Установка и запуск

Для установки и запуска проекта необходимо выполнить команды:

```
npm install
npm run start
```

или

```
yarn
yarn start
```

### Сборка

```
npm run build
```

или

```
yarn build
```

### MVP-архитектура

Проект разделен по паттерну **Model-View-Presenter**, где:

- **Model** — управление данными и бизнес-логика. Отвечает за загрузку товаров с API, хранение состояния корзины, валидацию форм и подготовку данных для отправки.
- **View** — пользовательский интерфейс. Отрисовывает компоненты, реагирует на действия пользователя (клики, ввод данных) и отражает состояние приложения.
- **Presenter** — посредник между Model и View (реализован на основе EventEmitter). Обрабатывает события от View, запрашивает обновление данных у Model и инициирует перерисовку View.

### Базовые классы

**EventEmitter** — общий класс для работы с событиями:

- `on(event, handler)` — подписка на событие;
- `off(event, handler)` — отмена подписки;
- `emit(event, data)` — генерация события с данными;
- `onAll(handler)` / `offAll(handler)` — универсальная подписка;
- `trigger(name, callback)` — вызов коллбэка по событию.

**Api** — базовый клиент для HTTP-запросов:

- `handleResponse(response)` — преобразование ответа в JSON или выброс ошибки;
- `get(url)` — GET-запрос;
- `post(url, data, method)` — POST/PUT/DELETE-запрос.

**Model** — родительский класс для моделей данных:

- `emitChanges()` — уведомление подписчиков об изменении состояния.

**Component** — базовый класс для UI-компонентов:

- `toggleClass(className)` — переключение CSS-класса;
- `setText(text)` — установка текстового содержимого;
- `setDisabled(state)` — блокировка/разблокировка элемента;
- `setHidden()` / `setVisible()` — управление видимостью;
- `setImage(src, alt)` — установка изображения;
- `render()` — генерация и возвращение DOM-элемента.

### Класс AppState

Отвечает за глобальное состояние приложения:

- `addToBasket(item: IProductItem)` — добавить товар в корзину;
- `removeFromBasket(item: IProductItem)` — удалить товар из корзины;
- `clearBasket()` — очистить корзину;
- `setDelivery(data: IDeliveryForm)` — сохранить данные доставки;
- `setContacts(data: IContactsForm)` — сохранить контактные данные;
- `setCatalog(items: IProductItem[])` — установить список товаров;
- `setPreview(id: string \| null)` — установить товар для предпросмотра;
- `validateDelivery(): IFormState` — проверить форму доставки;
- `validateContacts(): IFormState` — проверить форму контактов.

### Компоненты представления

**ContactsForm** — форма ввода email и телефона, наследуется от Component.  
**DeliveryForm** — выбор способа оплаты и адреса, наследуется от Component.  
**Page** — корневой компонент страницы, отображает каталог и корзину.  
**Card** — карточка товара с данными и кнопкой действия, расширяет IProductItem.  
**Basket** — отображение содержимого корзины и итоговой суммы.  
**Modal** — обёртка для модальных окон с любым содержимым.  
**Success** — экран подтверждения заказа с итоговой суммой.

## Типы данных

#### Основные типы из src/types/index.ts

```ts
export type Product = {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number;
};

export type PaymentMethod = 'card' | 'cash';

export type DeliveryData = {
	address: string;
	payment: PaymentMethod;
};

export type ContactData = {
	email: string;
	phone: string;
};

export type OrderInfo = {
	delivery: DeliveryData;
	contacts: ContactData;
	items: Product[];
};
```

#### Типы событий из EventEmitter

```ts
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
	eventName: string;
	data: unknown;
};

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}
```

## Модели (Model)

### `ApiModel`

Наследуется от `Api`, взаимодействует с сервером.

**Методы:**

- `getListProductCard()` — получение списка товаров;
- `postOrderLot(data)` — отправка заказа на сервер.

### `BasketModel`

Управление данными корзины.

**Методы:**

- `getCounter()` — количество товаров в корзине;
- `getSumAllProducts()` — сумма всех товаров;
- `setSelectedСard(product)` — добавление товара в корзину;
- `deleteCardToBasket(product)` — удаление товара из корзины;
- `clearBasketProducts()` — очистка корзины.

### `FormModel`

Хранение данных заказа.

**Методы:**

- `setOrderAddress(address, payment)` — установка адреса и способа оплаты;
- `validateOrder()` — валидация адреса и оплаты;
- `setOrderData(email, phone)` — установка контактных данных;
- `validateContacts()` — валидация email и телефона;
- `getOrderLot()` — получение финальных данных заказа.

## Представления (View)

### `Card`

Отображение карточки товара в каталоге.

**Методы:**

- `setText()` — установка текста;
- `cardCategory()` — установка категории;
- `setPrice()` — установка цены.

### `CardPreview`

Наследуется от `Card`, отображает товар в модалке.

**Методы:**

- `notSale()` — отображение состояния недоступности товара;
- `setPrice()`, `cardCategory()`, `setText()` — унаследованы.

### `Basket`

Контейнер корзины.

**Методы:**

- `renderHeaderBasketCounter(count)` — количество товаров в хедере;
- `renderSumAllProducts(sum)` — отображение итоговой суммы.

### `BasketItem`

Отображение одного товара в корзине.

**Методы:**

- `setPrice()` — установка цены.

### `Modal`

Управление модальными окнами.

**Методы:**

- `open(component)` — открытие модалки с компонентом;
- `close()` — закрытие модального окна.

### `Order`

Форма выбора адреса и способа оплаты.

**Методы:**

- `paymentSelection(callback)` — выбор варианта оплаты.

### `Contacts`

Форма ввода email и телефона.

### `Success`

Экран завершения заказа с итогом.

## Презентеры (Presenter)

Презентеры в проекте:

- `CatalogPresenter` — загружает каталог товаров и открывает модалку с превью карточки.
- `BasketPresenter` — управляет открытием и обновлением корзины, счётчиком и удалением товаров.
- `OrderPresenter` — обрабатывает оформление заказа: выбор доставки в `FormOrder`, ввод контактов в `FormContacts`, отправку заказа на сервер и показ экрана успеха.

## Сценарий работы приложения

1. Загрузка данных из API (`ApiModel`);
2. Сохранение списка товаров;
3. Отрисовка карточек в `Card` и `CardPreview`;
4. Клик на карточку — открытие модалки (`Modal`) с `CardPreview`;
5. Клик "В корзину" — передача данных в `BasketModel`, обновление `Basket`;
6. Открытие корзины — рендер `Basket`, `BasketItem`;
7. Клик "Оформить" — открытие формы оплаты и адреса (`FormOrder`);
8. Выбор способа оплаты и ввод адреса — отправка данных доставки (`delivery:submit`) и открытие формы контактов;
9. Ввод email и телефона — отправка контактных данных (`contacts:submit`);
10. Отправка заказа на сервер с товарными позициями, данными доставки и контактами;
11. Очистка корзины и показ экрана `Success`.
