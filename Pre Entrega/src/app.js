const express = require("express");

const PORT = 8080;
const app = express();

const ProductManager = require("./productManager");
const productManager = new ProductManager("./src/products.json");

const CartManager = require("./cartManager");
const cartManager = new CartManager("./src/carts.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req,res) => res.send("<h1>The server is on.</h1>"));

//Obtener Productos
app.get("/products", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts();

        if (!limit) {
            return res.status(200).json(products);
        } else {
            if (products.length >= limit) {
                return res.status(200).json(products.slice(0,limit));
            } else {
                return res.status(400).json({
                    error: "The limit indicated is superior to the number of products."
                })
            }
        }
    }

    catch (catchError) {
        return res.status(400).json({
            error: "Sorry, we have a problem."
        })
    }
});

//Obtener producto por id
app.get("/products/:id", async (req, res) => {
    try{
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(400).json({
                error: "The id was not indicated."
            });
        } else {
            const productFinded = await productManager.getProductByID(id);
            if (typeof productFinded === 'string') { //reversionar la validación
                return res.status(400).json(
                    {
                        error: productFinded
                    }
                );  
            } else {
                return res.status(200).json(productFinded);  
            }
        }
   
    } catch (error) {
        return res.status(400).json({
            error: "Sorry, we have a problem."
        })
    }

});

//Crear producto
app.post("/products", async (req, res) => {

    try{
       
        const product = req.body;

        if (!product) {

            return res.status(400).json({
                error: "The body is missing."
            });

        } else {

            const result = await productManager.addProduct(product);

            if (result !== "Added") {
                return res.status(400).json(
                    {
                        error: result
                    }
                );  
            } else {
                return res.status(200).json("The product was added successfuly.");  
            }
            
        }
   
    } catch (error) {

        return res.status(400).json({
            error: "Sorry, we have a problem."
        });

    }

});

//Modificar Producto
app.put("/products/:id", async (req, res) => {
    try{
        // chequear que no hay que agregar mas campos al product -- > ver consigna pre entregable
        const product = req.body;

        if (!req.body) {
            return res.status(400).json({
                error: "The body is missing."
            });
        } else {
            const result = await productManager.updateProduct(id, product);
            if (result !== "Updated") {
                return res.status(400).json(
                    {
                        error: result
                    }
                );  
            } else {
                return res.status(200).json("The product was updated successfuly.");  
            }
        }
   
    } catch (error) {
        return res.status(400).json({
            error: "Sorry, we have a problem."
        })
    }

});

//eliminar producto
app.delete("/products/:id", async (req, res) => {
    try{
        const id = parseInt(req.params.id);

        if (!id) { //chequear si esta valuidación esta ok.
            return res.status(400).json({
                error: "The id is missing."
            });
        } else {
            const result = await productManager.deleteProduct(id);
            if (result !== "Deleted") {
                return res.status(400).json(
                    {
                        error: result
                    }
                );  
            } else {
                return res.status(200).json("The product was deleted successfuly.");  
            }
        }
   
    } catch (error) {
        return res.status(400).json({
            error: "Sorry, we have a problem."
        })
    }

});

//Obtener productos de un carrito por idCarrito
app.get("/carts/:id", async (req, res) => {
    try{
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(400).json({
                error: "The id was not indicated."
            });
        } else {
            const productFinded = await productManager.getProductByID(id);
            if (typeof productFinded === 'string') { //reversionar la validación
                return res.status(400).json(
                    {
                        error: productFinded
                    }
                );  
            } else {
                return res.status(200).json(productFinded);  
            }
        }
   
    } catch (error) {
        return res.status(400).json({
            error: "Sorry, we have a problem."
        })
    }

});

//Crear un nuevo carrito
app.post("/carts", async (req, res) => {
    try{
        const products = req.body;

        if (!products) {
            return res.status(400).json({
                error: "The body is missing."
            });
        } else {
            const result = await cartManager.addCart(products);
            if (result !== "Added") {
                return res.status(400).json(
                    {
                        error: result
                    }
                );  
            } else {
                return res.status(200).json("The product was added successfuly.");  
            }
        }
   
    } catch (error) {
        return res.status(400).json({
            error: "Sorry, we have a problem."
        })
    }

});


//Obtener carrito por id
app.get("/carts/:id", async (req, res) => {
    try{
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(400).json({
                error: "The id was not indicated."
            });
        } else {
            const cartFinded = await cartManager.getCartByID(id);
            if (typeof cartFinded === 'string') { //reversionar la validación
                return res.status(400).json(
                    {
                        error: cartFinded
                    }
                );  
            } else {
                return res.status(200).json(cartFinded);  
            }
        }
   
    } catch (error) {
        return res.status(400).json({
            error: "Sorry, we have a problem."
        })
    }

});

//Agregar prod al carrito
app.put("/carts/:id", async (req, res) => {
    try{
        // chequear que no hay que agregar mas campos al product -- > ver consigna pre entregable
        const {idCart, idProduct, quantity} = req.body;

        if (!req.body) {
            return res.status(400).json({
                error: "The body is missing."
            });
        } else {
            const result = await cartManager.addToCartByID(idCart, idProduct, quantity);
            if (result !== "Updated") {
                return res.status(400).json(
                    {
                        error: result
                    }
                );  
            } else {
                return res.status(200).json("The product was updated successfuly.");  
            }
        }
   
    } catch (error) {
        return res.status(400).json({
            error: "Sorry, we have a problem."
        })
    }

});


const serverConnected = app.listen(PORT, () => {console.log(`The server is on. Port: ${PORT}`)});
serverConnected.on('error', error => {console.log(`server error: ${PORT}`)});