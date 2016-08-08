# imageStorage

Запуск проекта: **npm start**

URL по умолчанию: **http://localhost:3000**

Последовательность запуска:
- **npm install**
- **npm start**
- создание учетной записи администратора. POST запрос на адрес **/api/user** с телом запроса:
```
{
	username: 'admin',
	password: 'admin'
}
```
- создание клиента для приложения панели управления: POST запрос на адрес **/api/client** с телом запроса:
```
{
	name: 'admin client',
	id: 'admin_id'
	secret: 'admin_secret'
}
```
- авторизация в ПУ по адресу: **/admin** (встроены данные клиента, указанные выше)
- загрузка изображения по адресу: **/uploader** (Пользователям выдается uuid, c привязкой к нему сохраняется файл и комментарий к файлу)
