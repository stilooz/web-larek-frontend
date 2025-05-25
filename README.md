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
