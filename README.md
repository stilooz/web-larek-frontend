# Проектная работа "Веб-ларек (Фронтенд)"

**Стек:** HTML, SCSS, TypeScript, Webpack

## Структура проекта:

- `src/` — исходные файлы проекта
- `src/components/` — компонентная структура
- `src/components/base/` — базовые модули: API, EventEmitter
- `src/pages/index.html` — HTML-шаблон страницы
- `src/types/index.ts` — глобальные типы
- `src/index.ts` — точка входа
- `src/scss/styles.scss` — основной файл стилей
- `src/utils/constants.ts` — адреса API/CDN
- `src/utils/utils.ts` — вспомогательные функции

---

## Установка и запуск

---

## Настройки окружения

Для работы API требуется создать в корне проекта файл `.env` со следующим содержимым:

```
API_ORIGIN=https://larek-api.nomoreparties.co
```

Для запуска проекта:

```bash
npm install
npm run start
```

или

```bash
yarn
yarn start
```

## Сборка проекта

```bash
npm run build
```

или

```bash
yarn build
```

---

## Возможности

- Каталог товаров с загрузкой через API
- Предпросмотр карточки товара
- Добавление в корзину
- Оформление заказа с выбором оплаты и указанием адреса
- Валидация форм (адрес, email, телефон)
- Модульная архитектура (MVP + EventEmitter)
- Шаблонизация интерфейса через HTMLTemplateElement
- Webpack-сборка, .env-конфигурация

## Архитектура проекта

Проект реализован в парадигме **MVP**:

- **Model** — данные приложения (товары, корзина, формы)
- **View** — шаблоны и отображение UI (карточки, модальные окна)
- **Presenter** — логика связи между действиями пользователя, моделью и интерфейсом

---

## Архитектурная схема

```
User → UI → Events → Presenter → Model
        ↑       ↓
         View ← State
```

## Принципы взаимодействия

Взаимодействие между слоями происходит через **событийную модель**.  
Основной механизм подписки и передачи данных — `EventEmitter`.

---

## Пользовательские события

## Примеры работы с EventEmitter

```ts
events.on('cart: add', ({ product }) => {
	console.log('Добавлен товар:', product.title);
});

events.emit('cart: add', { product });
```

| Событие                    | Назначение                       |
| -------------------------- | -------------------------------- |
| `catalog: productSelected` | Выбор карточки для предпросмотра |
| `cart: add`                | Добавление товара в корзину      |
| `cart: remove`             | Удаление товара из корзины       |
| `cart: update`             | Обновление корзины               |
| `order: submit`            | Отправка данных заказа           |
| `order: success`           | Успешное оформление заказа       |

---

## Ключевые компоненты

### EventEmitter

Классический брокер событий:

- `on(event, handler)` — подписка
- `off(event, handler)` — отписка
- `emit(event, data)` — вызов события
- `onAll(handler)` — слушать все события
- `trigger(event)` — генерация коллбэка

---

### Api

Базовый класс для работы с HTTP-запросами:

- `get(uri: string): Promise<any>` — выполнить GET-запрос по заданному пути;
- `post(uri: string, data: unknown): Promise<any>` — выполнить POST-запрос с телом запроса.

### LarekApi

Наследует `Api` и расширяет его методами для взаимодействия с API магазина:

- `getProductList(): Promise<{ items: Product[] }>` — получить список товаров;
- `order(data: OrderFormData & ContactFormData): Promise<{ id: string }>` — отправить заказ.

---

### cloneTemplate

Утилита для шаблонов:

```ts
const card = cloneTemplate<HTMLDivElement>('#card-catalog');
```

---

## Классы и интерфейсы (в соответствии с MVP)

### Model

```ts
interface Product {
	id: string;
	title: string;
	description: string;
	price: number;
	imageUrl: string;
}

interface CartItem {
	product: Product;
	quantity: number;
}

interface OrderFormData {
	paymentMethod: string;
	address: string;
}

interface ContactFormData {
	email: string;
	phone: string;
}
```

### View

- Отвечает за отображение карточек товаров, модальных окон и форм.
- Использует шаблоны HTMLTemplateElement для рендеринга UI.

### Presenter

- Обрабатывает пользовательские события.
- Связывает Model и View.
- Управляет логикой приложения.

### EventEmitter

- Управляет событиями между слоями.
- Обеспечивает подписку, отписку и передачу данных через события.

---

(Типы и архитектура вынесены из `src/types/index.ts` для удобства документации и понимания.)

---

## Детализация архитектуры

### Классы представлений (View)

#### `Component<T>`

Базовый абстрактный класс для UI-компонентов.

```ts
class Component<T> {
	constructor(protected container: HTMLElement) {}

	setState(state: Partial<T>): void;
	render(): void;
	destroy(): void;
}
```

---

#### `Modal`, `Basket`, `Form`, `Success`

Наследуются от `Component<unknown>`. Реализуют специфичный UI.

```ts
class Modal extends Component<unknown> {
	open(): void;
	close(): void;
}
```

```ts
class Form extends Component<OrderFormData | ContactFormData> {
	validate(): boolean;
	getData(): OrderFormData | ContactFormData;
}
```

---

#### `Page`, `Card`, `Order`, `Contacts`

Наследники `Component<T>` с конкретной реализацией отображения.

```ts
class Card extends Component<Product> {
	constructor(container: HTMLElement, product: Product, events: IEvents);
	render(): void;
	handleClick(): void;
}
```

---

### Класс модели (Model)

#### `AppData`

Хранит состояние приложения. Отвечает за бизнесс-логику.

```ts
class AppData {
	private catalog: Product[] = [];
	private basket: CartItem[] = [];
	private order: OrderFormData = { payment: 'cash', address: '' };
	private contacts: ContactFormData = { email: '', phone: '' };

	setCatalog(items: Product[]): void;
	getCatalog(): Product[];

	addToCart(product: Product): void;
	removeFromCart(productId: string): void;
	getCart(): CartItem[];

	setOrder(data: OrderFormData): void;
	getOrder(): OrderFormData;

	setContacts(data: ContactFormData): void;
	getContacts(): ContactFormData;
}
```

---

### Посредник (EventEmitter)

#### `EventEmitter`

Универсальный механизм событий.

```ts
type EventHandler<T> = (payload: T) => void;

class EventEmitter {
	on<K extends keyof AppEventMap>(
		event: K,
		handler: EventHandler<AppEventMap[K]>
	): void;
	off<K extends keyof AppEventMap>(
		event: K,
		handler: EventHandler<AppEventMap[K]>
	): void;
	emit<K extends keyof AppEventMap>(event: K, payload: AppEventMap[K]): void;
	onAll(handler: (event: string, payload: unknown) => void): void;
	trigger(event: string): void;
}
```

---

## Схема наследования View

```
               Component<T>
                   ↑
 ┌─────────────────┼─────────────────┐
 │                 │                 │
Modal          Basket             Form
                                    ↑
                         ┌──────────┴───────────┐
                       Order               Contacts

     (параллельно)
                   Page, Card, Success
```

---

## Схема связи компонентов

```
   [User Action]
        ↓
     [View] ------------------.
        ↓                    |
  [EventEmitter]             |
        ↓                    ↑
    [AppData] <-------------'
        ↓
     [Presenter]
        ↓
     [View update]
```
