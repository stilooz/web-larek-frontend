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

## Архитектура проекта

Проект реализован в парадигме **MVP**:

- **Model** — данные приложения (товары, корзина, формы)
- **View** — шаблоны и отображение UI (карточки, модальные окна)
- **Presenter** — логика связи между действиями пользователя, моделью и интерфейсом

---

## Принципы взаимодействия

Взаимодействие между слоями происходит через **событийную модель**.  
Основной механизм подписки и передачи данных — `EventEmitter`.

---

## Пользовательские события

| Событие                    | Назначение                       |
| -------------------------- | -------------------------------- |
| `catalog: productSelected` | Выбор карточки для предпросмотра |
| `cart: add`                | Добавление товара в корзину      |
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

### Api и LarekApi

Классы для работы с API:

- `get(uri)` — получить данные
- `post(uri, data)` — отправка заказа
- `getProductList()` — получить список товаров

---

### cloneTemplate

Утилита для шаблонов:

```ts
const card = cloneTemplate<HTMLDivElement>('#card-catalog');
```
