class ProductManager {
    products = [];
    latestId = 0;
    constructor(){};
    addProduct(title,description,price,thumbnail,code,stock){
        if (title !== '' && description !== '' && price > 0 && thumbnail !== '' && stock > 0 && code !== ''){
            if (!(this.products.some(product => product.code === code))) {
                this.products.push({
                id: ProductManager.incrementId(),
                title,
                description,
                price,
                thumbnail,
                code,
                stock
                });
            } else {
                console.log('There is another product with the same code.');
            }
        } else {
            console.log('There are properties not complete or invalid.');
        }
    }
    getProducts(){
        return this.products.length > 0 ? this.products : "No Products.";
    }
    static incrementId(){
        if (!this.latestId) {
            this.latestId = 1
        } else {
            this.latestId++
        }
        return this.latestId;
    }
    getProductByID(id){
        if (!this.products.some(product => product.id === id)) {
            return "Not Found";
        } else {
            return this.products.find(product => product.id === id);
        }
    }
}

// TESTEO DEL ENTREGABLE
const productManager = new ProductManager();
console.log(productManager.getProducts());
productManager.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25);
console.log(productManager.getProducts());
productManager.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25);
console.log(productManager.getProductByID(1));
console.log(productManager.getProductByID(3));