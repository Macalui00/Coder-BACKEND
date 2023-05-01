const express = require("express");

const PORT = 8080;
const app = express();

const ProductManager = require("./productManager");
const productManager = new ProductManager("./products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req,res) => res.send("The server is on."));

app.get("/products", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts();

        if (!limit) {
            return res.json(products);
        } else {
            if (products.length >= limit) {
                return res.json(products.slice(limit));
            } else {
                return res.json({
                    error: "The limit indicated is superior to the number of products."
                })
            }
        }
    }

    catch (error) {
        console.log(error);
    }
});

app.get("/products/:id", async (req, res) => {
    try{
        const id = parseInt(req.params.id);

        if (!id) {
            return res.json({
                error: "The id isn't indicated."
            });
        } else {
            const productFinded = await productManager.getProductByID(id);   
            return res.json(productFinded);  
        }
   
    } catch(error) {
        console.log(error);
    }

})


const serverConnected = app.listen(PORT, () => {console.log(`The server is on. Port: ${PORT}`)});
serverConnected.on('error', error => {console.log(`server error: ${PORT}`)});