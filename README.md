```

```

# Документація

## Варіант індивідуального завдання

---

**N** = 25 - номер у списку групи

| Змінна |   Формула    | Результат | Значення                                                                                |
| :----: | :----------: | :-------: | --------------------------------------------------------------------------------------- |
|   V2   | (25 % 2) + 1 |     2     | Конфігураційний файл за шляхом `/etc/mywebapp/config.json`<br />База даних - PostgreSQL |
|   V3   | (25 % 3) + 1 |     2     | Застосунок - Task Tracker                                                               |
|   V5   | (25 % 5) + 1 |     1     | Порт застосунку - 8080                                                                  |

##### **Мережеві обмеження:**

| Компонент | Адреса    | Порт |
| --------- | --------- | ---- |
| nginx     | 0.0.0.0   | 80   |
| web app   | 127.0.0.1 | 8080 |
| SQL БД    | 127.0.0.1 | 5432 |

## **Розроблений веб-застосунок**

---

Task Tracker - простий REST API сервіс для керування списком задач. Він дозволяє створювати нові задачі, переглядати список існуючих та відзначати їх як виконані.

##### Об’єкт задачі має наступні поля:

- `id`
- `title`
- `status`
- `created_at`

##### API сервісу складається з 3 ендпоінтів:

- `GET /tasks `— вивести усі задачі (id, title, status, created_at)
- `POST /tasks (title)` — створити нову задачу
- `POST /tasks/<id>/done` — змінити статус задачі на виконано

##### Стек технологій:

- **Runtime:** Node.js
- **Framework:** Express.js
- **База даних:** PostgreSQL
- **Драйвер БД:** pg (node-postgres)
- **Reverse proxy:** Nginx
- **Менеджер сервісів:** systemd

##### Налаштування середовища та запуск:

- **Середовище** : Node.js (версія 18+), PostgreSQL
- **База даних** : Створити БД `mywebapp_db` та користувача `mywebapp`
- **Конфігурація** : Файл `/etc/mywebapp/config.json` має містити параметри підключення до БД та налаштування порту. Для локальної розробки можна створити файл **`config.local.json`** в корені проєкту з реальними параметрами підключення. Цей файл додано до **`.gitignore`**
- **Запуск:**

```
# встановити залежності
npm install
```

Варіант для локального конфігу (`config.local.json`):

```
# запуск міграції
# Windows (PowerShell):
$env:CONFIG_PATH="./config.local.json"; node migration.js

# Linux/macOS (bash):
CONFIG_PATH=./config.local.json node migration.js

# запуск застосунку
# Windows (PowerShell):
$env:CONFIG_PATH="./config.local.json"; node server.js

# Linux/macOS (bash):
CONFIG_PATH=./config.local.json node server.js
```

Варіант для системного конфігу (`/etc/mywebapp/config.json`, для запуску на Linux):

```
# запуск міграції
node migration.js

# запуск застосунку
node server.js
```

##### API-ендпоінти:

**Health ендпоінти**

> Health ендпоінти доступні тільки напряму до застосунку (`127.0.0.1:8080`). Через nginx вони заблоковані.

`GET /health/alive` - перевірка, що застосунок запущений. Завжди повертає `200 OK`

`GET /health/ready` - перевірка, що застосунок підключений до БД і готовий обробляти запити.

**Бізнес-логіка**

`GET /tasks` - повертає список всіх задач

`POST /tasks` - створює нову задачу. Тіло запиту: `{ "title": "назва задачі" }`

`POST /tasks/:id/done` - змінює статус задачі на `done`

> Всі ендпоінти бізнес-логіки та кореневий ендпоінт підтримують два формати відповіді залежно від заголовку `Accept`:
>
> - `Accept: application/json` — відповідь у форматі JSON
> - `Accept: text/html` — відповідь у форматі HTML
>
> Якщо заголовок `Accept` відсутній або має інше значення — повертається `406 Not Acceptable`.

## Документацію по розгортанню

---

Використовується офіційний образ **Ubuntu Server 24.04.4 LTS**

Завантажити можна з офіційного сайту (розділ "Previous releases"): [https://ubuntu.com/download/server](https://ubuntu.com/download/server)

Перевірено у середовищі Oracle VirtualBox

##### Вимоги до ресурсів віртуальної машини:

| Ресурс  |     Мінімум     |  Рекомендовано  |
| :------ | :-------------: | :-------------: |
| CPU     |     1 ядро      |     2 ядра      |
| RAM     |      1 ГБ       |      2 ГБ       |
| Disk    |      10 ГБ      |      20 ГБ      |
| Network | Bridged Adapter | Bridged Adapter |

##### Налаштування при встановленні OS:

- Спеціальних налаштувань розбивки диску не потрібно
- На кроці "SSH Setup" - поставити галочку "Install OpenSSH server".
  Або встановити вручну після входу в систему:
  ```
  sudo apt install openssh-server
  sudo systemctl enable ssh
  sudo systemctl start ssh
  ```

##### **Credentials за замовчуванням** (до запуску `setup.sh`):

- Користувач: `admin`
- Пароль: той що вказали при встановленні Ubuntu

##### Як увійти на ВМ (через SSH):

`ssh admin@<IP_ВМ>`

##### Як завантажити та запустити автоматизацію розгортання:

1. Склонувати репозиторій:

Склонувати репозиторій:

```
git clone https://github.com/Liza-Khube/KPI_DevOps.git
cd KPI_DevOps
```

2. Зроби скрипт виконуваним:

```
chmod +x setup.sh
```

3. Запусти скрипт від root:

```
sudo bash setup.sh
```

> Після виконання скрипт заблокує дефолтного користувача. Можна увійти як `student`, `teacher` або `operator` з паролем `12345678` (пароль потрібно буде змінити при першому вході)

## Інструкція з тестування

---

**Перевірка користувачів**

```
# чи всі юзери існують
id student && id teacher && id app && id operator

# чи app не може логінитись
getent passwd app  # має бути /usr/sbin/nologin
```

**Перевірка мережі**

```
# чи nginx слухає на 0.0.0.0:80, а застосунок слухає на 127.0.0.1:8080
sudo ss -tlnp | grep :80

# чи PostgreSQL слухає на 127.0.0.1
sudo ss -tlnp | grep :5432
```

**Перевірка health ендпоінтів**

```
# Напряму до застосунку — мають повертати 200 OK
curl http://127.0.0.1:8080/health/alive
curl http://127.0.0.1:8080/health/ready

# Через nginx — мають повертати 404 (заблоковані)
curl -v http://localhost/health/alive
curl -v http://localhost/health/ready
```

**Перевірка бізнес-логіки**

```
# Кореневий ендпоінт — тільки text/html
curl -v -H "Accept: text/html" http://localhost/         # має повернути 200 + HTML
curl -v -H "Accept: application/json" http://localhost/  # має повернути 406

# Список задач
curl -H "Accept: application/json" http://localhost/tasks
curl -H "Accept: text/html" http://localhost/tasks

# Без заголовку Accept
curl -v http://localhost/tasks  # має повернути 406

# Створити задачу
curl -X POST \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"title": "test task"}' \
  http://localhost/tasks

# Змінити статус
curl -X POST \
  -H "Accept: application/json" \
  http://localhost/tasks/1/done

# Неіснуюча задача — має повернути 404
curl -v -X POST \
  -H "Accept: application/json" \
  http://localhost/tasks/999/done
```

**Перевірка systemd та socket activation**

```
# Статус сервісів
sudo systemctl status mywebapp.socket
sudo systemctl status mywebapp.service

# Socket activation
sudo systemctl stop mywebapp.service
curl -H "Accept: application/json" http://localhost/tasks
sudo systemctl status mywebapp.service  # має бути active
```

**Перевірка operator**

```
su - operator

# Дозволені команди
sudo systemctl stop mywebapp.service
sudo systemctl start mywebapp.service
sudo systemctl restart mywebapp.service
sudo systemctl status mywebapp.service
sudo systemctl reload nginx

# Заборонені команди — мають повертати помилку
sudo systemctl restart nginx
sudo apt install curl
```

**Перевірка файлів**

```
cat /home/student/gradebook  # має бути 25
```
