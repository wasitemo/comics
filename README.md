# Studi Kasus

**Nama Perusahaan**

Bronze Climate Emporium

**Deskripsi Perusahaan**

Kami adalah toko kecil yang menjual komik. Produk utama kami menonjol karena kualitas dan finishing yang superior. Target pasar kami adalah dewasa. Kami ingin menyampaikan rasa kesetiaan, sambil tetap bersemangat.

**Deskripsi Pekerjaan**

Anda harus membuat situs web yang terutama menyediakan dukungan pelanggan untuk perusahaan. Tujuannya adalah memberikan pengalaman pengguna yang luar biasa. Selain halaman utama, situs web perlu memiliki halaman informasi, halaman produk, dan blog. Halaman utama harus memiliki bagian “Nilai-Nilai Kami”. Harus ada ajakan bertindak (call to action) untuk mendorong pengguna berlangganan buletin. Mereka lebih menyukai desain yang trendi dan ingin Anda menggunakan warna merek, yaitu kuning. Perhatikan preferensi dan nilai-nilai klien.

## Tech Stack

### Backend

- Express js
- Postgresql

### Frontend

- Next js

## Features

### Backend

- JWT authentication
- Offset-based Pagination
- Migration
- CRUD

## Documentation

https://comics-2mkb.onrender.com/public/api-docs

## Environment Variable

### Backend

<table>
  <tr>
    <th>Variable</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>PORT</td>
    <td>YOUR_PORT</td>
  </tr>
  <tr>
    <td>DATABASE_URL</td>
    <td>YOUR_LINK_DATABASE OR postgresql://username:<password>@localhost:5432/db_name</td>
  </tr>
  <tr>
    <td>JWT_REFRESH_SECRET</td>
    <td>YOUR_REFRESH_SECRET</td>
  </tr>
  <tr>
    <td>JWT_ACCESS_SECRET</td>
    <td>YOUR_ACCESS_SECRET</td>
  </tr>
  <tr>
    <td>REFRESH_TOKEN_EXPIRES</td>
    <td>YOUR_REFRESH_TOKEN_EXPIRES</td>
  </tr>
  <tr>
    <td>ACCESS_TOKEN_EXPIRES</td>
    <td>YOUR_ACCESS_TOKEN_EXPIRES</td>
  </tr>
  <tr>
    <td>MAX_AGE_COOKIE</td>
    <td>YOUR_DURATION_COOKIE_IN_MS</td>
  </tr>
  <tr>
    <td>SALT</td>
    <td>YOUR_SALT</td>
  </tr>
  <tr>
    <td>NODE_ENV</td>
    <td>YOUR_MODE</td>
  </tr>
  <tr>
    <td>LOG_LEVEL</td>
    <td>YOUR_LOG_LEVEL</td>
  </tr>
  <tr>
    <td>CLOUD_NAME</td>
    <td>YOUR_CLOUDINARY_CLOUD_NAME</td>
  </tr>
  <tr>
    <td>CLOUD_KEY</td>
    <td>YOUR_CLOUDINARY_API_KEY</td>
  </tr>
  <tr>
    <td>CLOUD_PASSWORD</td>
    <td>YOUR_CLOUDINARY_API_SECRET</td>
  </tr>
</table>

## Setup

### Backend

#### Clone Repository

```
git clone https://github.com/wasitemo/comics.git
cd backend
```

#### Install Node Modules

```
npm install
```

#### Run Server

```
nodemon index.js
```

## Footer

**Source:** https://goodbrief.io

**Backend** by Navyrine

**Frontend** by kmsyunus
