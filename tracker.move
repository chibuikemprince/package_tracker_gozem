module hello::package_tracker {
    use std::vector;
    use std::string;
    use std::signer;

    /// Represents a product in the supply chain.
    struct Product has store, copy {
        id: string::String,       // Unique identifier for the product.
        storeId: u64,             // Unique store ID for the product.
        name: string::String,     // Name of the product.
        status: string::String,   // Current status of the product.
        owner: address,           // Address of the product's owner.
        latitude:string::String,       
        longitude: string::String      
    }

    /// Represents the product store, storing all products.
    struct ProductStore has key {
        products: vector<Product>, // Vector of all products in the supply chain.
    }

    /// Initializes the module by creating an empty product store.
      fun init_module(signer: &signer) {
        let addr = signer::address_of(signer);
        assert!(!exists<ProductStore>(addr), 1); // Ensure the resource doesn't already exist.
        move_to(signer, ProductStore {
            products: vector::empty<Product>(), // Initialize with an empty vector.
        });
    }

    /// Creates a new product in the store.
    public fun create_product(signer: &signer, id: string::String, name: string::String, status: string::String, latitude: string::String, longitude: string::String) 
    acquires ProductStore {
        let addr = signer::address_of(signer); // Get the signer's address.
        let product_store = borrow_global_mut<ProductStore>(addr); // Access the ProductStore resource.

        let storeId: u64 = vector::length(&product_store.products); // Use the current length as the storeId.

        let new_product = Product {
            id,
            storeId,
            name,
            status,
            owner: addr, // Set the owner to the signer's address.
            latitude,   
            longitude,
        };

        vector::push_back(&mut product_store.products, new_product); // Add the new product to the vector.
    }

    /// Updates the status of a product if the signer is the owner.
    public fun update_product_status(signer: &signer, storeId: u64, new_status: string::String) acquires ProductStore {
        let addr = signer::address_of(signer); // Get the signer's address.
        let product_store = borrow_global_mut<ProductStore>(addr); // Access the ProductStore resource.

        // Ensure the storeId is valid.
        let product_count = vector::length(&product_store.products);
        assert!(storeId < product_count, 2); // Error code 2: Invalid storeId.

        let product_ref = vector::borrow_mut(&mut product_store.products, storeId);

        // Ensure the signer is the owner of the product.
        assert!(product_ref.owner == addr, 3); // Error code 3: Not the owner.

        product_ref.status = new_status; // Update the status.
    }

    /// Updates the location of a product if the signer is the owner.
    public fun update_product_location(signer: &signer, storeId: u64, new_latitude: string::String, new_longitude: string::String) acquires ProductStore {
        let addr = signer::address_of(signer); // Get the signer's address.
        let product_store = borrow_global_mut<ProductStore>(addr); // Access the ProductStore resource.

        // Ensure the storeId is valid.
        let product_count = vector::length(&product_store.products);
        assert!(storeId < product_count, 2); // Error code 2: Invalid storeId.

        let product_ref = vector::borrow_mut(&mut product_store.products, storeId);

        // Ensure the signer is the owner of the product.
        assert!(product_ref.owner == addr, 3); // Error code 3: Not the owner.

        product_ref.latitude = new_latitude;  
        product_ref.longitude = new_longitude;  
    }

    /// Gets a product's details by its storeId.
    
    public fun get_product(signer: &signer, storeId: u64): Product acquires ProductStore {
        let addr = signer::address_of(signer); // Get the signer's address.
        let product_store = borrow_global<ProductStore>(addr); // Access the ProductStore resource.

        // Ensure the storeId is valid.
        let product_count = vector::length(&product_store.products);
        assert!(storeId < product_count, 2); // Error code 2: Invalid storeId.

        let product_ref = vector::borrow(&product_store.products, storeId);

        *product_ref // Return the product.
    }
}