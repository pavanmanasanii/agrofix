// backend/app.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const pool = require('./db'); // Import database connection
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const bcrypt = require('bcrypt');
const { get } = require('react-hook-form');

// Test DB connection
pool.connect()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((err) => {
    console.error('Error connecting to the database', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Basic root route
app.get('/', (req, res) => {
  res.send('Agrofix backend is live 🌱🚀');
});

//API REGISTER
app.post('/register', async (request, response) => {
  const { name, email, password } = request.body;
  console.log(request.body)
  try {
    const searchUserQuery = 'SELECT * FROM users WHERE name = $1';
    const registerUser = await pool.query(searchUserQuery, [name]);
    if (registerUser.rows.length > 0) {
      return response.status(401).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const postUserQuery = `
      INSERT INTO users (name, email, passwordhash, role)
      VALUES ($1, $2, $3, $4)
    `;
   const result= await pool.query(postUserQuery, [name, email, hashedPassword, 'buyer']);
    response.status(201).send({ message: 'User registered successfully' });
  
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: 'Internal Server Error' });
  }
});

//API LOGIN
app.post('/login/',async (request, response) => {
  console.log(request.body)
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM users WHERE name = $1`;
  try {
    const result = await pool.query(selectUserQuery, [username]);
    if (result.rows.length === 0) {
      response.status(400).send('Invalid user');
      return;
    }
    const dbUser = result.rows[0];
    const isPasswordMatched = await bcrypt.compare(password, dbUser.passwordhash);
    if (isPasswordMatched) {
      const payload = { username: dbUser.username };
      const jwtToken = jwt.sign(payload, 'pavan');
      console.log(jwtToken)
      response.send({ jwtToken });
    } else {
      response.status(400).send('Invalid password');
    }
  } catch (error) {
    console.error('Login error:', error);
    response.status(500).send('Server error');
  }
});


const middleware = (request, response, next) => {
  const authheader = request.headers['authorization']
  console.log(authheader)
  let jwtToken
  if (authheader !== undefined) {
    jwtToken = authheader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
   return response.send('Invalid JWT Token12')
  } else {
    jwt.verify(jwtToken, 'pavan', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Invalid JWT Token23')
      } else {
        request.user=payload
        next()
      }
    })
  }
}

// GET /api/products: Fetch the product catalogue.
app.get('/api/products',middleware,async (request,response) => {
   const getproducts = `select * from products`
   try{
    const result = await pool.query(getproducts)
    response.send(result.rows)
    console.log(result)
   }catch(error){
    response.status(500).send('Server error');
   }
})

// POST /api/orders Place a new order.
app.post('/api/orders',middleware,async (request,response) => {
  const {buyer_name,buyer_contact,delivery_address,items,status} = request.body
  console.log(request.body)
  const itemsJson = JSON.stringify(items);
  console.log(itemsJson)
  if (request.user && request.user.role === 'buyer') {
    const orderproductsquery = `INSERT INTO orders (buyer_name,buyer_contact,delivery_address,items,status) VALUES($1, $2, $3, $4, $5) RETURNING *;`;
    try{
      const result = await pool.query(orderproductsquery, [
        buyer_name,
        buyer_contact,
        delivery_address,
        itemsJson,
        "Pending"
      ])
      response.send(result.rows[0]);
    }
    catch(error){
      console.error('Error inserting product:', error);
      response.status(500).send('Server error');
    }
  }
  else{
    response.status(403).send('Access denied: Buyers only');
  }
})

// GET /api/orders/:id: View order details (for buyers).
app.get('/api/orders/:id',middleware, async(request,response) => {
  const {id} = request.params
  if(request.user.id == id && request.user.role ==='buyer'){
    try{
      const getOrder = `SELECT * FROM orders where userid=$1;`;
      const result = await pool.query(getOrder,[id])
      response.send(result.rows)
    }
    catch(error){
      console.error('Error fetching order:', error);
      response.status(500).send('Server error');
    }
  }
  else{
    response.status(403).send('Unauthorized');
   }
})

// GET /api/orders: View all orders (for admins)
app.get('/api/orders',middleware, async(request,response) => {
  if(request.user && request.user.role === 'admin'){
    try{
      const getAllorders = `select * from orders;`;
      const result = await pool.query(getAllorders);
      response.send(result.rows)
    }catch(error){
      response.status(500).send('Server error');
    }
  }
  else{
    response.status(403).send('Unauthorized');
   }
})

// PUT /api/orders/:id: Update order status (for admins).
app.put('/api/orders/:id',middleware, async (request,response) => {
   const {id} = request.params
   const {buyer_name,buyer_contact,delivery_address,items,status} = request.body
   const values = [
    buyer_name,
    buyer_contact,
    delivery_address,
    JSON.stringify(items), // assuming items is a JS object or array
    status,
    id
  ];
   if(request.user && request.user.role === 'admin'){
    try{
    const updateOrder = `UPDATE orders SET buyer_name=$1,
    buyer_contact=$2,
    delivery_address=$3,
    items=$4,
    status=$5
    where id=$6 RETURNING *;`;
    const result = await pool.query(updateOrder,values)
    response.status(200).json(result.rows[0]);
    }
    catch(error){
      console.error('Error fetching order:', error);
      response.status(500).send('Server error');
    }
   }
   else{
    response.status(403).send('Unauthorized');
   }
})

// POST /api/products: Add a new product (for admins).
app.post('/api/products',middleware,async(request,response) => {
  const {name,price,quantity,image_url} = request.body
   if(request.user && request.user.role === 'admin'){
    try{
      const addProducts = `INSERT INTO products VALUES($1,$2,$3,$4) RETURNING *;`;
      const result = await pool.query(addProducts,[name,price,quantity,image_url])
      response.send(result.rows[0])
    }catch(error){
      console.error('Error inserting product:', error);
      response.status(500).send('Server error');
    }
   }else{
    response.status(403).send('Unauthorized');
   }
})

// PUT /api/products/:id: Edit an existing product (for admins).
app.put('/api/products/:id',middleware,async(request,response) => {
  const {id} = request.params
  const {name,price,quantity,image_url} = request.body
  if(request.user && request.user.role === 'admin'){
    try{
      const updateproduct = `UPDATE products set name='$1',
      price=$2,
      quantity=$3,
      image_url=$4 where id=$5 RETURNING *;`;
      const result = await pool.query(updateproduct,[name,price,quantity,image_url,id])
      if (result.rows.length === 0) {
        return response.status(404).send('Product not found');
      }
      response.json(result.rows[0]);
    }
    catch(error){
      console.error('Error fetching order:', error);
      response.status(500).send('Server error');
    }
  }
  else{
    response.status(403).send('Unauthorized');
   }
})

// DELETE /api/products/:id: Remove a product (for admins).
app.delete('/api/products/:id',middleware,async(request,response) => {
  const {id} = request.params
  if(request.user && request.user.role === 'admin'){
    try{
      const deleteProduct = `DELETE FROM products where id=$1 RETURNING *;`
      const result = await pool.query(deleteProduct,[id])

      if (result.rows.length === 0) {
        return response.status(404).send('Product not found');
      }

      response.json(send(result.rows[0]))
    }catch(error){
      response.status(500).send('Server error');
    }
  }
  else{
    response.status(403).send('Unauthorized');
   }
})

// Route to get all products
// app.get('/products', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM products');
//     res.json(result.rows);  // Send products as JSON
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error fetching products');
//   }
// });


