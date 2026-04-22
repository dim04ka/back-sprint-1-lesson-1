# Blogger API

REST API для управления блогами и постами, построенное на Express и TypeScript. Проект поддерживает полный CRUD функционал для работы с блогами и постами, включает Swagger документацию и готов к деплою на Vercel.

## Описание

API предоставляет возможность управления коллекцией блогов и постов. Блоги поддерживают пагинацию и сортировку, посты связаны с блогами через blogId. Данные хранятся в MongoDB.

## Основные возможности

- ✅ CRUD операции для блогов (создание, чтение, обновление, удаление)
- ✅ CRUD операции для постов (создание, чтение, обновление, удаление)
- ✅ Пагинация и сортировка для списка блогов
- ✅ Валидация входных данных
- ✅ Swagger документация API
- ✅ Защита эндпоинтов через super-admin guard
- ✅ E2E тестирование
- ✅ Готовность к деплою на Vercel (serverless функции)

## Технологии

- **Express** - веб-фреймворк для Node.js
- **TypeScript** - типизированный JavaScript
- **MongoDB** - база данных
- **Swagger** - документация API
- **Jest** - фреймворк для тестирования
- **ESLint & Prettier** - линтинг и форматирование кода

## Установка

```bash
# Установка зависимостей
pnpm install
```

## Запуск проекта

### Разработка

```bash
# Компиляция TypeScript в watch режиме
pnpm watch

# Запуск сервера в режиме разработки (в отдельном терминале)
pnpm dev
```

Сервер будет доступен по адресу: `http://localhost:5001`

### Продакшн

```bash
# Компиляция
tsc

# Запуск
node dist/index.js
```

## API Endpoints

### Блоги

- `GET /blogs` - получить список блогов (с пагинацией и сортировкой)
- `GET /blogs/:id` - получить блог по ID
- `POST /blogs` - создать новый блог (требует super-admin)
- `PUT /blogs/:id` - обновить блог (требует super-admin)
- `DELETE /blogs/:id` - удалить блог (требует super-admin)

**Параметры запроса для GET /blogs:**
- `pageNumber` - номер страницы (по умолчанию: 1)
- `pageSize` - размер страницы (по умолчанию: 10)
- `sortBy` - поле для сортировки (createdAt, isMembership, name)
- `sortDirection` - направление сортировки (asc, desc)

### Посты

- `GET /posts` - получить список постов
- `GET /posts/:id` - получить пост по ID
- `POST /posts` - создать новый пост (требует super-admin)
- `PUT /posts/:id` - обновить пост (требует super-admin)
- `DELETE /posts/:id` - удалить пост (требует super-admin)

### Тестирование

- `DELETE /testing/all-data` - очистить все данные (для тестирования)

### Документация

- `GET /api` - Swagger UI документация

## Структура проекта

```
src/
├── blogs/                # Модуль блогов
│   ├── application/     # Бизнес-логика
│   ├── domain/          # Доменные типы
│   ├── repository/      # Репозиторий для работы с БД
│   └── routes/          # Роуты и обработчики
│       ├── handlers/    # Обработчики запросов
│       ├── input/       # Типы входных данных
│       ├── mapper/      # Маппинг данных
│       ├── output/      # Типы выходных данных
│       └── validate/    # Валидация
├── posts/               # Модуль постов
│   ├── dto/             # Data Transfer Objects
│   ├── mapper/          # Маппинг данных
│   ├── repository/      # Репозиторий для работы с БД
│   └── routes/          # Роуты и обработчики
│       ├── handlers/    # Обработчики запросов
│       └── validate/    # Валидация
├── core/                # Ядро приложения
│   ├── errors/          # Обработка ошибок
│   ├── helpers/         # Вспомогательные функции
│   ├── middlewares/     # Middleware (валидация, guards)
│   ├── path/            # Константы путей
│   ├── swagger/         # Конфигурация Swagger
│   └── types/           # Общие типы
├── db/                  # Работа с базой данных
│   └── mongo.db/        # Подключение к MongoDB
├── testing/             # Роуты для тестирования
├── index.ts             # Точка входа приложения
└── setup-app.ts         # Настройка Express приложения
```

## Тестирование

```bash
# Запуск тестов
pnpm jest
```

## Линтинг и форматирование

```bash
# Линтинг с автоисправлением
pnpm lint

# Форматирование кода
pnpm format
```

## Деплой на Vercel

Проект настроен для деплоя на Vercel через serverless функции. Конфигурация находится в файле `vercel.json`.

## Переменные окружения

Создайте файл `.env` в корне проекта со следующими переменными:

```env
MONGO_CONNECT_URL=mongodb://localhost:27017
MONGO_DB_NAME=blogger
AC_SECRET=your-super-secret
AC_TIME=15m
PORT=5001
NODE_ENV=development
```

## Примеры использования

### Создание блога

```bash
POST /blogs
Content-Type: application/json
Authorization: Basic <super-admin-credentials>

{
  "name": "Мой блог",
  "description": "Описание моего блога",
  "websiteUrl": "https://example.com"
}
```

### Получение списка блогов с пагинацией и сортировкой

```bash
GET /blogs?pageNumber=1&pageSize=10&sortBy=createdAt&sortDirection=desc
```

### Обновление блога

```bash
PUT /blogs/:id
Content-Type: application/json
Authorization: Basic <super-admin-credentials>

{
  "name": "Обновленное название",
  "description": "Обновленное описание",
  "websiteUrl": "https://updated-example.com"
}
```

### Создание поста

```bash
POST /posts
Content-Type: application/json
Authorization: Basic <super-admin-credentials>

{
  "title": "Заголовок поста",
  "shortDescription": "Краткое описание поста",
  "content": "Полное содержание поста",
  "blogId": "blog-id-here"
}
```
