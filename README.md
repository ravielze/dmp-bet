# Jobs Search Backend 

Backend Developer Test PT Dans Multi Pro

# Installation
1. Lakukan `npm install`
2. Install Prisma CLI jika belum, `npm install prisma --save-dev`
3. Copy `.env.example` ke `.env`, Lakukan penyesuaian terutama pada **database url**
4. Lakukan migrasi database, `npx prisma migrate dev`
5. Lakukan `npm run start` untuk menjalankan
6. Gunakan CURL atau Postman untuk menggunakan API

# Techstack
- Typescript, Javascript, Node.JS
- Prisma & PostgreSQL
- Class Validator
- TypeDI (dependency injection)
- ExpressTS
- JsonWebToken
- Bcrypt

# Endpoints

Catatan: Sesuaikan **{ENDPOINT}** dengan url local. Contoh: http://localhost:3000

## Register
URL: `https://{ENDPOINT}/api/auth/register`

Note: Password akan dihash, gabisa insert via database.

Body: 
```
{
    "username": "username",
    "password": "password"
}
```
CURL:
```
curl --location --request POST 'http://localhost:3000/api/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "user",
    "password": "pwd"
}
```

## Login
URL: `https://{ENDPOINT}/api/auth/login`
Body:
```
{
    "username": "username",
    "password": "password"
}
```
CURL:
```
curl --location --request POST 'http://localhost:3000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "user",
    "password": "pwd"
}
```

## Get Job List
URL: `https://{ENDPOINT}/api/jobs/`
Header:
```
Authorization: Bearer <token>
```
Query:
- item_per_page: number, optional, default=10
- page: number, optional, default=1
- description: string, optional
- location: string, optional
- full_time: true/false, optional

CURL:
```
curl --location --request GET 'http://localhost:3000/api/jobs?page=2&item_per_page=4&description=office' \
--header 'Authorization: Bearer <token>' \
```

## Get Job Detail
URL: `https://{ENDPOINT}/api/jobs/<id>`
Header:
```
Authorization: Bearer <token>
```
Param:
- id: string, required

CURL:
```
curl --location --request GET 'http://localhost:3000/api/jobs/<id>' \
--header 'Authorization: Bearer <token>' \
```