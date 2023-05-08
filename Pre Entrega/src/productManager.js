const fs = require('fs');

class ProductManager {
    constructor(path){

        path = path ?? '';

        this.products = [{
            id: 1,
            title: "Gorra de sol", 
            description: "Gorra de Sol Adidas",
            price: 4300, 
            thumbnail: "Sin imagen", 
            code: "xsa213s", 
            stock: 13
        },
        {
            id: 2,
            title: "Gomita de Pelo", 
            description: "Gomita de Pelo de tela.",
            price: 2000, 
            thumbnail: "Sin imagen", 
            code: "aqw120g", 
            stock: 10
        },
        {
            id: 3,
            title: "Zapatillas", 
            description: "Zapatillas Nike",
            price: 28000, 
            thumbnail: "Sin imagen", 
            code: "aq1f27d", 
            stock: 5
        },
        {
            id: 4,
            title: "Sandalias", 
            description: "Sandalias Goma",
            price: 230000, 
            thumbnail: "Sin imagen", 
            code: "aqw23c3", 
            stock: 4
        },
        {
            id: 5,
            title: "Maya enteriza", 
            description: "Maya enteriza",
            price: 7200, 
            thumbnail: "Sin imagen", 
            code: "dge12c3", 
            stock: 14
        },
        {
            id: 6,
            title: "Pantalon", 
            description: "Pantalon Puma",
            price: 21300, 
            thumbnail: "Sin imagen", 
            code: "zvd1236", 
            stock: 10
        },
        {
            id: 7,
            title: "Medias", 
            description: "Medias Adidas",
            price: 5430, 
            thumbnail: "Sin imagen", 
            code: "vv1234s", 
            stock: 18
        },
        {
            id: 8,
            title: "Guantes Boxeo", 
            description: "Guantes de Boxeo",
            price: 20230, 
            thumbnail: "Sin imagen", 
            code: "asd82ss", 
            stock: 23
        },
        {
            id: 9,
            title: "Tennis", 
            description: "Tennis Adidas",
            price: 34500, 
            thumbnail: "Sin imagen", 
            code: "asfa82as", 
            stock: 20
        },
        {
            id: 10,
            title: "Calzas", 
            description: "Calzas Nike",
            price: 9500, 
            thumbnail: "Sin imagen", 
            code: "cvfa82as", 
            stock: 14
        }];

        this.latestId = 10;

        if (path === ''){
            console.log("The parameter Path is incompleted.");
        } else {
            this.path = path;
        }

    };

    incrementId(){
        if (!this.latestId) {
            this.latestId = 1
        } else {
            this.latestId++
        }
        return this.latestId;
    }

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

    validAddProduct(product) {

        let {title,description,category,price,thumbnail,code,stock} = product;
        
        title = title ?? '';
        description = description ?? '';
        category = category ?? '';
        price = price ?? '';
        code = code ?? '';
        stock = stock ?? 0;

        if (title !== '' && description !== '' && category !== '' && price > 0 && stock > 0 && code !== ''){

            if ((this.products.some((product) => {product.code === code}))) {

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

    async addProduct(product){

        await this.readFileAndProcess();  
        if(this.validAddProduct(product)) {

            let {title,description,category,price,thumbnail,code,stock} = product;
            let id = this.incrementId();
            
            const finalProduct = 
                {
                    id,
                    title,
                    description,
                    category,
                    price,
                    thumbnail,
                    code,
                    status: true,
                    stock
                }
            
            if(!fs.existsSync(this.path)){ 
            
                this.products.push(finalProduct);
                await this.writeFile();
                return 'Added';
            
            } else {
                try{

                    await this.readFileAndProcess();  
                    this.products.push(finalProduct);            
                    await this.writeFile();
                    return this.incrementId();

                } catch(error){
                    return error;
                }
            }
            
        } else {

            return 'Equal code to another product';

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

                return "Not Found";

            } else {

                try {
                    await this.readFileAndProcess();

                    const productIndex = this.products.findIndex((product) => product.id === id);

                    if (productIndex === -1) {

                        return "Not Found";

                    } else {

                        this.products[productIndex] = {id: this.products[productIndex].id, ...product};
                        await this.writeFile();
                        return "Updated";

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
                        return "Deleted"
                    }

                } catch(error){
                    console.log(error);
                }
                
            }

        }
    }
}

module.exports = ProductManager;