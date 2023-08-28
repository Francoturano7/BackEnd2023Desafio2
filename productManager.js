const fs = require("fs");

class ProductManager {
    constructor(path) {
        this.path = path
        this.products = []
    }
    loadDB = async () => {

        if (fs.existsSync(this.path)) {
            const productsString = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(productsString);
            this.products = products;
        }
    }

    async getProducts() {
        try {
            await this.loadDB()
            return this.products;
        } catch (error) {
            console.log("error", error.message);
        }
    }

    async getProductById(idProduct) {
        try {
            const productFound = this.#validateId(idProduct)
            if (productFound) {
                console.log(productFound)
            } else {
                console.log("Product not found")
            }
        } catch (error) {
            console.log("error", error.message)
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                return console.log("All fields are required")
            }
            const codeExist = this.#validateCode(code)
            if (codeExist) {
                console.log("Product already exist")
            } else {
                const product = {
                    id: this.#createId(),
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
                this.products.push(product)
                const productsString = JSON.stringify(this.products, null, 2);
                await fs.promises.writeFile(this.path, productsString);
                console.log("Product added successfully")
            }
        } catch (error) {
            console.log("error", error.message)
        }
    }

    async updateProduct(id, product) {
        try {
            await this.getProducts()
            let productIndex = this.products.findIndex(prod => prod.id == id)
            if (productIndex === -1) {
                return console.log("Product not found")
            }
            if (product.id) {
                return console.log("Cannot modify id field")
            }
            this.products[productIndex] = { ...this.products[productIndex], ...product }
            const productsString = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, productsString);
            return console.log("Product updated successfully");
        } catch (error) {
            console.log("error", error.message)
        }
    }

    async deleteProducts(id) {
        try {
            await this.getProducts()
            let productIndex = this.products.findIndex(prod => prod.id == id)
            if (productIndex === -1) {
                return console.log("Product not found")
            }
            this.products.splice(productIndex, 1)
            const productsString = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, productsString);
            return console.log("Product deleted successfully");
        } catch (error) {
            console.log("error", error.message)
        }
    }

    #createId() {
        let id =
            this.products.length === 0
                ? 1
                : this.products[this.products.length - 1].id + 1
        return id
    }

    #validateCode(code) {
        return this.products.find(product => product.code === code)
    }

    #validateId(id) {
        return this.products.find(product => product.id === id)
    }
}




const operations = async () => {
    try {
        const manager = new ProductManager("./products.json")
        const products = await manager.getProducts()
        console.log(products)
        // await manager.addProduct("Iphone 13", "Celular", 950, "./iphone", 101, 82)
        // await manager.addProduct("MacBook Pro", "PC", 2600, "./pc", 103, 47)
        //  await manager.addProduct("Ipad Mini", "Tablet", 1600, "./tablet", 102, 65)
        // console.log(products)

        // await manager.getProductById(2)
        // await manager.getProductById(8)

        // await manager.updateProduct(2,{price:2800,stock:75 })

        //  await manager.deleteProducts(3)

    } catch (error) {
        console.log("error", error.message)
    }
}

operations()