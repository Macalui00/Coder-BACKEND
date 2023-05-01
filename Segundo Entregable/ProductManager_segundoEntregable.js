const fs = require('fs');

class ProductManager {
    constructor(path){

        path = path ?? '';

        this.products = [];
        this.latestId = 0;

        if (path === ''){
            console.log("The parameter Path is incompleted.");
        } else {
            this.path = path;
        }

    };

    async readFileAndProcess(){
        try{
            let productsString = await fs.promises.readFile(this.path,'utf-8');

            console.log('The file was readen successfully.'); 

            this.products = JSON.parse(productsString);

        } catch(error) {
            console.log('It happened a problem to read the file.');
        }
    }

    async writeFile(){
        await fs.promises.writeFile(this.path, JSON.stringify(this.products), (err) => {
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
        if(this.validAddProduct(title,description,price,thumbnail,code,stock)) {
            
            const product = 
                {
                    id: ProductManager.incrementId(),
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
            
            if(!fs.existsSync(this.path)){ 
            
                this.products.push(product);
                await this.writeFile();
                console.log('Product added succesfully');
            
            } else {
                try{

                    await this.readFileAndProcess();  
                    this.products.push(product);            
                    await this.writeFile();
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

                await this.readFileAndProcess(); 
                return this.products.length > 0 ? this.products : "No Products.";

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

                    await this.readFileAndProcess(); 

                    if (!this.products.some(product => product.id === id)) {
                        return "Not Found";
                    } else {
                        return this.products.find(product => product.id === id);
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

        if(this.validUpdateProduct(id, product)){

            if(!fs.existsSync(this.path)){
                return "The product was not found.";
            } else {
                try {
                    await this.readFileAndProcess();

                    const productIndex = this.products.findIndex((product) => product.id === id);

                    if (productIndex === -1) {

                        return "The product was not found";

                    } else {

                        this.products[productIndex] = {id: this.products[productIndex].id, ...product};
                        await this.writeFile();

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

                    await this.readFileAndProcess(); 

                    if (!this.products.some((product) => product.id === id)) {
                        return "Not Found.";
                    } else {
                        this.products = this.products.filter((product) => product.id !== id);
                        await this.writeFile();
                        return "The product was deleted succesfully"
                    }

                } catch(error){
                    console.log(error);
                }
                
            }

        }
    }
}

// TESTING
async function test() {
    // CREATE OBJECT OF PRODUCT MANAGER
    const productManager = new ProductManager('Products.txt');

    console.log('\nProduct Manager Created.');
    console.log('\n--------------------------------------------\n');

    // GET ACTUAL PRODUCTS
    console.log('Get Actual Products: ');
    console.log(await productManager.getProducts());

    console.log('\n--------------------------------------------\n');

    console.log('Adding a new product...');
    await productManager.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25);

    console.log('\n--------------------------------------------\n');

    console.log('Get Actual Products:');
    console.log(await productManager.getProducts());

    console.log('\n--------------------------------------------\n');

    console.log('Adding a another product...');
    await productManager.addProduct('producto prueba 2','Este es un producto prueba 2',200,'Sin imagen','ads123',28);
    
    console.log('\n--------------------------------------------\n');

    console.log('Adding a another product with the same code...');
    await productManager.addProduct('producto prueba 2','Este es un producto prueba 2',200,'Sin imagen','ads123',28);    
    
    console.log('\n--------------------------------------------\n');

    console.log('Get Actual Products:');
    console.log(await productManager.getProducts());

    console.log('\n--------------------------------------------\n');

    console.log('Get Product By ID = 1:');
    console.log(await productManager.getProductByID(1));

    console.log('\n--------------------------------------------\n');

    console.log('Get Product By ID = 3:');
    console.log(await productManager.getProductByID(3));

    console.log('\n--------------------------------------------\n');

    const productToUpdate = {
        title: 'producto prueba', 
        description: 'Este es un producto prueba editado',
        price: 200, 
        thumbnail: 'Sin imagen', 
        code: 'aqw123', 
        stock: 10
    }

    console.log('Update Product with ID = 1: ');
    await productManager.updateProduct(1, productToUpdate);

    console.log('\n--------------------------------------------\n');

    console.log('Get Product By ID = 1:');
    console.log(await productManager.getProductByID(1));

    console.log('\n--------------------------------------------\n');

    console.log('Delete Product By ID = 1:');
    console.log(await productManager.deleteProduct(1));

    console.log('\n--------------------------------------------\n');

    console.log('Get Actual Products:');
    console.log(await productManager.getProducts());
}

test();
