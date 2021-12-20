# Crime Report Backend

> This is an API for a crime reporting system.

---

### Table of Contents

- [Description](#description)
- [API Reference](#api-reference)
- [How To Use](#how-to-use)
- [Author Info](#author-info)

---

## Description

This is and API for crime reporting system. Once the user registers his/her data is stored in mysql users database and password is stored in hashed format. When the user logs in, he/she is provided with access token and refresh token. The reports registered by user is stored in reports database.

## API Reference

#### Get all reports

```http
  GET /api/lists
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get report

```http
  GET /api/lists/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Technologies

- Express
- Mysqli

[Back To The Top](#read-me-template)

---

## How To Use

Clone the github repo https://github.com/kal412/crime-project-backend.git

#### Installation

Open your terminal
First initialize package.json with

```html
npm init -y
```

After initialization enter

```html
npm install
```

---

## Author Info

- LinkedIn - [kalyan412](https://www.linkedin.com/in/kalyan412/)
- Instagram - [devkota.kalyan98](https://www.instagram.com/devkota.kalyan98/)

[Back To The Top](#read-me-template)
