<p align='left'>
    <img src='https://static.wixstatic.com/media/85087f_0d84cbeaeb824fca8f7ff18d7c9eaafd~mv2.png/v1/fill/w_160,h_30,al_c,q_85,usm_0.66_1.00_0.01/Logo_completo_Color_1PNG.webp' </img>
</p>

# Markets Center - API

<p align="right">
  <img height="200" src="https://user-images.githubusercontent.com/86481813/168854600-5f78aaca-b87a-406d-813f-1095d8cd7879.png"/>
</p>

## About
This project consists of the development of a S.P.A (Single Page Application). It is part of the Bootcamp Henry group project, in which a group of 7 developers participated. On this page, you can access as a seller and thus create, edit and delete products that are for sale and view your sales history.
As a buyer you have access to a favorites section, shopping cart, profile with your data and purchase history, you can also make purchases using the Stripe payment gateway. Finally, the admin actor will be able to keep track of the categories, the purchases made and the users.

## Objectives
- Create a profile with your data.
- Create, edit, delete and search products.
- Filter by categories and sellers.
- Sort alphabetically and by price.
- Add products to the shopping cart and buy them.
- Add products to the favorite list.
- Add comments and rating to a bought product.
- Manage users, categories, orders and see statistics graphic of seller orders in admin profile.

## Stack of Technologies
Typescript, NodeJS, Express, MongoDB, Mongoose, FireBase, Stripe, NodeMailer, Cloudinary, SendGrid

[Deploy](https://markets-center.vercel.app/)
<br/>
[Review in Youtube](https://www.youtube.com/watch?v=N0nbWDKR-Cc)

## BoilerPlate

You must create an [Firebase](https://firebase.google.com/), [MongoDB](https://account.mongodb.com/account/login),  [Stripe](https://dashboard.stripe.com/login), [Cloudinary](https://cloudinary.com/users/login) and [SendGrid](https://app.sendgrid.com/login) accounts and create a file called: `.env` that has the following form: 

```
MONGO_URL=mongo_url
CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_secret
GOOGLE_APPLICATION_CREDENTIALS=google_application_credentials
EMAIL_SERVICE=SendGrid
EMAIL_USERNAME=api_key
EMAIL_PASSWORD=email_password
EMAIL_FROM=marketscenter.pg@gmail.com
STRIPE_API_KEY=stripe_api_key
```

## Next 
### _Connect the data base_

 - Replace all `.env` information with database information

 ### _Install the necesary package to run it_

- Open the project console
    + Inside `api` folder, run the command line, `yarn add`.

### _Run the project_

- Open the project console    
    + Inside `api` folder, run the command line, `yarn run dev` and go to `http://localhost:4000/`.

## Some Example Endpoints
[GET /products](https://backend-markets-center.herokuapp.com/api/public/products)
<br/>
[GET /products?name=Papas](https://backend-markets-center.herokuapp.com/api/public/products?name=Papas)
<br/>
[GET /products/:id](https://backend-markets-center.herokuapp.com/api/public/product/62701f42cdc206940ccc751a)
<br/>
[GET /categories](https://backend-markets-center.herokuapp.com/api/public/categories)
<br/>
[GET /filter?id](https://backend-markets-center.herokuapp.com/api/public/filter?id=626ffb9ab4e05ccbb92b7ed7)
<br/>
[GET /filter?category=Bebidas](https://backend-markets-center.herokuapp.com/api/public/filter?categories=Bebidas)
<br/>
[GET /filter?id&&categories=Bebidas](https://backend-markets-center.herokuapp.com/api/public/filter?id=626ffb9ab4e05ccbb92b7ed7&&categories=Bebidas)
<br/>
[GET /users/sellers](https://backend-markets-center.herokuapp.com/api/private/users/sellers)
