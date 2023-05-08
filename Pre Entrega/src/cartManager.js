const fs = require('fs');

class CartManager {
    constructor(path){

        path = path ?? '';

        this.carts = [];

        this.latestId = 0;

        if (path === ''){
            console.log("The parameter Path is incompleted.");
        } else {
            this.path = path;
        }

    };

    async readFileAndProcess(){
        try{
            let cartsString = await fs.promises.readFile(this.path,'utf-8');

            console.log('The file was readen successfully.'); 

            this.carts = JSON.parse(cartsString);

        } catch(error) {
            console.log('It happened a problem to read the file.');
        }
    }

    async writeFile(){
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts), (err) => {
            if (err) {
                console.log('It happened a problem to write the file.');
            } else {
                console.log('The file was written successfully.')
            }
        });
    }

    async addCart(products){
        if(products !== null && products !== undefined) {
            
            const cart = 
                {
                    id: CartManager.incrementId(),
                    products: products
                }
            
            if(!fs.existsSync(this.path)){ 
            
                this.carts.push(cart);
                await this.writeFile();
                return 'Added';
            
            } else {
                try{

                    await this.readFileAndProcess();  
                    this.carts.push(cart);         
                    await this.writeFile();
                    return 'Added';

                } catch(error){
                    return error;
                }
            }
            
        } else {
            return 'Products Missing'; // quizas esto vaya mas arriba.
        }
    }
 
    static incrementId(){
        if (!this.latestId) {
            this.latestId = 1
        } else {
            this.latestId++
        }
        return this.latestId;
    }

    async getCartByID(id){

        id = id ?? -1;

        if(id === -1) {
            return "The giving id is incorrect.";
        } else {

            if(!fs.existsSync(this.path)){
                return "Not Found.";
            } else {

                try {

                    await this.readFileAndProcess(); 

                    if (!this.carts.some(cart => cart.id === id)) {
                        return "Not Found";
                    } else {
                        return this.carts.find(cart => cart.id === id);
                    }

                } catch(error){
                    console.log(error);
                }
                
            }

        }

    }

    // add product to cart by id
    validAddToCart(idCart, idProduct, quantity){

        idCart = idCart ?? -1;
        idProduct = idProduct ?? -1;
        quantity = quantity ?? - 1;

        if (idCart !== -1 && idCart !== -1 && quantity !== -1){
            return true
        } else {
            return false
        }

    }

    //REVISAR TODA LA FUNCION
    async addToCartByID(idCart, idProduct, quantity){
        //lo valido aca o mas "arriba"
        idCart = idCart ?? -1;
        idProduct = idProduct ?? -1;
        quantity = quantity ?? - 1;

        if(this.validAddToCart(idCart, idProduct, quantity)) {
            return "Some parameters are incorrect / missing";
        } else {

            if(!fs.existsSync(this.path)){
                return "Not Found";
            } else {

                try {

                    await this.readFileAndProcess(); 

                    if (!this.carts.some(cart => cart.id === idCart)) {
                        return "Not Found";
                    } else {
                        const cart = this.carts.find(cart => cart.id === idCart);

                        if (!cart.products.some(product => product.id == idProduct)){

                            const product = {
                                id: idProduct,
                                quantity: quantity
                            }

                            cart.products.push(product);
                            
                            const cartIndex = this.carts.findIndex((cart) => cart.id === idCart);

                            if (cartIndex === -1) {

                                return "Not Found";

                            } else {

                                this.carts[cartIndex] = cart;
                                await this.writeFile();
                                return "Added";

                            }

                        } else {
                            
                            const cartIndex = cart.findIndex((cart) => cart.id === idCart);

                            if (cartIndex === -1) {

                                return "Not Found";

                            } else {
                                
                                const productIndex = cart[cartIndex].products.findIndex((product) => product.id === idProduct);

                                if (productIndex === -1) {

                                    return "Not Found";

                                } else {

                                    cart[cartIndex].products[productIndex] = cart[cartIndex].products[productIndex].quantity += quantity;
                                    
                                }

                                this.carts[cartIndex] = cart;
                                await this.writeFile();
                                return "Added";

                            }

                        }
                    }

                } catch(error){
                    console.log(error);
                }
                
            }

        }

    }


}

module.exports = CartManager;