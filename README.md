# Sofia & Nikita — Wedding Invitation 💍

Свадебное приглашение с кинематографическими анимациями и визуальными эффектами.

## 🎯 Текущая версия: v3 — Mobile-First Performance

### Реализованные функции

**Секции сайта:**
- **Loading Screen** — анимированные кольца с монограммой
- **Hero** — полноэкранный первый «слайд» (`100dvh`), canvas-система частиц (осколки, лепестки, блёстки), SVG-рамка, золотые имена с shimmer-градиентом, параллакс (desktop)
- **About** — романтическая история с плавающими декоративными «блобами», крутящийся SVG-значок
- **Countdown** — живой таймер обратного отсчёта до 01.08.2026 15:00, canvas-частицы
- **Save the Date** — звёздное поле на canvas, стилизованная дата, хештег
- **Footer** — монограмма, дата, декоративные элементы

**Визуальные эффекты:**
- 3 canvas-системы частиц (hero, countdown, savedate)
- Кинематографические переходы между секциями (IntersectionObserver + CSS transitions)
- Gold shimmer / goldShift градиентные анимации для текста
- Touch Sparkle — золотые искры при касании (мобильный)
- Cursor Glow + Sparkle Trail (десктоп)
- Scroll Reveal (IntersectionObserver)
- Floating decorations, heartbeat, SVG leaf frame

### 🚀 v3 — Оптимизации для Safari iOS (60fps)

**JavaScript:**
- Hero canvas: 45 частиц на мобильном (было 60), 120 на десктопе
- Убраны glow orbs (radialGradient) и rings на мобильном — самые дорогие типы
- Shards на мобильном: только треугольники, без glow aura
- Countdown particles: 14 на мобильном (было 18)
- Starfield: 25 звёзд на мобильном (было 35), без shooting stars
- Pre-computed color strings (без runtime string concatenation)
- Touch sparkle: throttle 200ms + меньше элементов
- Resize debounce увеличен до 400ms

**CSS (главные изменения):**
- **Секции на мобильном**: transition только по opacity (без transform) — compositor-only, нет jank
- **Убрано на мобильном:**
  - `filter: drop-shadow()` на hero names и savedate day
  - `filter: blur()` на всех ::after pseudo-элементах
  - `backdrop-filter: blur()` — только через `@media (hover: hover)` (desktop)
  - `breatheGlow` анимация на hero::before (статичная opacity)
  - `floatBlob` анимация на flora элементах (статичные)
  - `quoteShimmer` и `cardShimmer` ::after sweeps
  - `savedate::after` breathing glow (статичная opacity)
- **Убрано `will-change`** с countdown parallax-bg и hero canvas (не нужны)
- Все section dividers уменьшены на мобильном

**Сохранено на мобильном (красота без лагов):**
- Все 3 canvas-системы частиц (с уменьшенным количеством)
- goldShift / shimmer анимации на текстах
- spinSlow на иконке About
- floatSoft на ornaments и amp
- heartbeat + heartPulseRing
- Touch Sparkle
- Scroll Reveal
- Все gradient dividers между секциями

### Структура файлов

```
index.html          — основная страница
css/style.css       — стили + анимации + responsive
js/main.js          — JS логика + canvas + transitions
README.md           — документация
```

### Маршруты

| Путь | Описание |
|------|----------|
| `/` | Главная (приглашение) |
| `/#hero` | Hero секция |
| `/#about` | О нас |
| `/#countdown` | Обратный отсчёт |
| `/#savedate` | Save the Date |

### Ещё не реализовано

- Реальные фотографии пары
- Фоновая музыка (кнопка готова, MP3 не подключён)
- Дополнительные секции: программа, дресс-код, место проведения
- RSVP форма
- Карта проезда

### Рекомендуемые следующие шаги

1. Добавить реальные фотографии
2. Подключить фоновую музыку (MP3)
3. Добавить секцию с деталями церемонии
4. Добавить RSVP форму (можно через RESTful Table API)
5. Добавить карту проезда (Google Maps embed)
