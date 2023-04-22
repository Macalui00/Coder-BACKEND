const fs = require('fs');

class ProductManager {
    constructor(path){

        path = path ?? '';

        this.products = [];
        this.latestId = 0;

        if (path === ''){
            console.log("The parameter Path is incompleted.")
        } else {
            this.path = path;
        }

    };

    async readFileAndProcess(){
        try{
            let productsList = await fs.promises.readFile(this.path,'utf-8');

            console.log('The file was readen successfully.'); //chequear los textos

            productsList = JSON.parse(productsList);

            return productsList;

        } catch(error) {
            console.log('It happened a problem to read the file.');
        }
    }

    async writeFile(products){
        await fs.promises.writeFile(this.path, JSON.stringify(products), (err) => {
            if (err) {
                console.log('It happened a problem to write the file.');
            } else {
                console.log('The file was written successfully.')
            }
        });
    }

    validAddProduct(title,description,price,thumbnail,code,stock){
        
        title = title ?? '';
        description = description ?? '';
        price = price ?? '';
        thumbnail = thumbnail ?? '';
        code = code ?? '';
        stock = stock ?? 0;

        if (title !== '' && description !== '' && price > 0 && thumbnail !== '' && stock > 0 && code !== ''){
            if ((this.products.some(product => product.code === code))) {
               console.log('There is another product with the same code.');
               return false
            } else {
                return true
            }
        } else {
            console.log('There are properties not complete or invalid.');
            return false
        }

    }

    async addProduct(title,description,price,thumbnail,code,stock){
        if(validProduct(title,description,price,thumbnail,code,stock)) {
            
            const producto = 
                {
                    id: ProductManager.incrementId(),
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
            
            if(!fs.existsSync(this.path)){ //faltan los try catch o callbacks para error
            
                const products = [producto];
                await this.writeFile(products);
            
            } else {
                try{

                    let productsList = await this.readFileAndProcess();  
                    productsList.push(producto);            
                    await this.writeFile(productsList);
                    console.log('Product added successfully.');

                } catch(error){
                    console.log(error);
                }
            }
            
        } 
    }
    async getProducts(){

        if(!fs.existsSync(this.path)){
            return "No Products.";
        } else {
            try {

                let products = await this.readFileAndProcess(); 
                return products.length > 0 ? products : "No Products.";

            } catch(error){
                console.log(error);
            }
            
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

    async getProductByID(id){

        id = id ?? -1;

        if(id === -1) {
            return "The giving id is incorrect.";
        } else {

            if(!fs.existsSync(this.path)){
                return "Not Found.";
            } else {

                try {

                    let products = await this.readFileAndProcess(); 

                    if (!products.some(product => product.id === id)) {
                        return "Not Found";
                    } else {
                        return products.find(product => product.id === id);
                    }

                } catch(error){
                    console.log(error);
                }
                
            }

        }

    }

    validUpdateProduct(id, product){

        id = id ?? -1;
        product = product ?? {};
    
        if(id === -1) {

            console.log("The giving id is incorrect.");
            return false;

        } else {

            if(Object.entries(product).length === 0){

                console.log("The giving object is empty.");
                return false;

            } else {
                return true;
            }     

        }        
    }

    async updateProduct(id, product){

        if(validUpdateProduct(id, product)){

            if(!fs.existsSync(this.path)){
                return "The product was not found.";
            } else {
                try {
                    let products = await readFileAndProcess();

                    const productIndex = products.findIndex((product) => product.id === id);

                    if (productIndex === -1) {

                        return "The product was not found";

                    } else {

                        products[productIndex] = {...product, id: products[productIndex].id};
                        await this.writeFile(products);

                    }
                } catch(error){
                    console.log(error);
                }
            }

        }  

    }

    async deleteProduct(id){

        id = id ?? -1;

        if(id === -1) {
            return "The giving id is incorrect.";
        } else {

            if(!fs.existsSync(this.path)){
                return "Not Found.";
            } else {

                try {

                    let products = await this.readFileAndProcess(); 

                    if (!products.some(product => product.id === id)) {
                        return "Not Found.";
                    } else {
                        products.filter(product => product.id !== id);
                        await this.writeFile(products);
                    }

                } catch(error){
                    console.log(error);
                }
                
            }

        }
    }
}

// TESTING

// CREATE OBJECT OF PRODUCT MANAGER
const productManager = new ProductManager();

console.log('\nProduct Manager Created.');
console.log('\n--------------------------------------------\n');

// GET ACTUAL PRODUCTS
console.log('Get Actual Products: ');
console.log(productManager.getProducts());

console.log('\n--------------------------------------------\n');

console.log('Adding a new product...');
productManager.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25);

console.log('\n--------------------------------------------\n');

console.log('Get Actual Products:');
console.log(productManager.getProducts());

console.log('\n--------------------------------------------\n');

console.log('Adding a another product...');
productManager.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25);

console.log('\n--------------------------------------------\n');

console.log('Get Product By ID = 1:');
console.log(productManager.getProductByID(1));

console.log('\n--------------------------------------------\n');

console.log('Get Product By ID = 3:');
console.log(productManager.getProductByID(3));