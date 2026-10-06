# Warehouse Map — прототип

Карта склада с роботами-погрузчиками (AGV).

## Стек

- React 19 + TypeScript
- Redux Toolkit
- Tailwind CSS v4
- react-konva (Konva.js)
- Vite

## Запуск

```bash
cd warehouse-map
npm install
npm run dev
```

Откройте http://localhost:5173

## Что есть в прототипе

- **Карта склада** (canvas через Konva): зоны, стеллажи, сетка
- **Zoom / pan**: колёсико мыши + drag, кнопки +/−/1:1
- **6 роботов** с разными статусами (idle, moving, loading, charging, error)
- **Реалтайм-движение** движущихся роботов (mock, без API)
- **Список роботов** слева с фильтрами по статусу и батареей
- **Детали робота** справа: позиция, батарея, назначение задания
- **Назначение задачи** (откуда → куда) для свободных роботов

## Структура

```
src/
  components/
    Header.tsx          — шапка со счётчиками статусов
    WarehouseMap.tsx    — карта (Konva Stage)
    RobotList.tsx       — список + фильтры
    RobotDetails.tsx    — панель деталей и назначение задач
  store/
    index.ts            — Redux store
    robotsSlice.ts      — состояние роботов и задач
    hooks.ts            — типизированные хуки
  data/mock.ts          — мок-данные склада и роботов
  types/index.ts        — TypeScript-типы
```

## Дальше

1. Подключить WebSocket / SSE к реальному API
2. Заменить mock-движение на координаты с сервера
3. Добавить отрисовку маршрутов и зон хранения
4. История перемещений, алерты по ошибкам
