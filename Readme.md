# Package Tracker Smart Contract

The **Package Tracker Smart Contract** is a Move-based smart contract designed to manage and track products in a supply chain. It provides functionalities to create, update, and retrieve product details, ensuring transparency and accountability in the supply chain process. Below is a detailed description of the contract's functionalities.

Testnet Onchain link
https://testnet.suprascan.io/tx/76ec683d28a74ac49d0100967cbdd58f574b32bd328930476d32b0919887d6a7/f?tab=advanced%20information

Function Structure: 0xf424262169d2828dfeff2313efdc0bd21507839e87f9c1af3e5175711b437992::package_tracker::{FUNCTION_NAME}

## **Functionalities**

### **1. Module Initialization**

- **Function**: `init_module(signer: &signer)`
- **Description**: Initializes the module by creating an empty `ProductStore` for the signer. This function ensures that each signer has their own unique product store.
- **Key Points**:
  - The `ProductStore` is a resource that stores all products associated with the signer.
  - This function must be called before any other operations, as it sets up the necessary storage for products.
  - If a `ProductStore` already exists for the signer, the function will fail.

---

### **2. Create a New Product**

- **Function**: `create_product(signer: &signer, id: string::String, name: string::String, status: string::String, latitude: string::String, longitude: string::String)`
- **Description**: Adds a new product to the signer's `ProductStore`.
- **Key Points**:
  - Each product has the following attributes:
    - `id`: A unique identifier for the product.
    - `storeId`: A unique store ID (auto-generated based on the number of products in the store).
    - `name`: The name of the product.
    - `status`: The current status of the product (e.g., "In Transit", "Delivered").
    - `owner`: The address of the product's owner (set to the# Package Tracker Smart Contract

The Package Tracker smart contract is a decentralized application (dApp) built on the Supra blockchain that allows users to manage the lifecycle of products in a supply chain. The contract provides the following key functionalities:

## Initialization

The `init_module` function initializes the smart contract by creating an empty `ProductStore` resource. This resource will store all the products in the supply chain.

## Product Management

The contract provides the following functions to manage products:

1. **Create Product**: The `create_product` function allows users to create a new product in the supply chain. It takes the product's ID, name, status, latitude, and longitude as input parameters.

2. **Update Product Status**: The `update_product_status` function allows the owner of a product to update its status. It takes the product's store ID and the new status as input parameters.

3. **Update Product Location**: The `update_product_location` function allows the owner of a product to update its location. It takes the product's store ID, new latitude, and new longitude as input parameters.

4. **Get Product Details**: The `get_product` function allows users to retrieve the details of a product by its store ID.

## Access Control

The contract enforces access control to ensure that only the owner of a product can update its status or location. The `signer` argument is used to identify the user executing the transaction and verify their ownership of the product.

## Data Structure

The contract uses the following data structures to represent the supply chain:

1. **Product**: This struct represents a product in the supply chain, with fields for the product's ID, store ID, name, status, owner, latitude, and longitude.

2. **ProductStore**: This resource stores a vector of all the products in the supply chain.

## Usage Example

Here's an example of how the Package Tracker smart contract can be used:

1. Initialize the module by calling the `init_module` function.
2. Create a new product by calling the `create_product` function.
3. Update the status of the product by calling the `update_product_status` function.
4. Update the location of the product by calling the `update_product_location` function.
5. Retrieve the details of the product by calling the `get_product` function.

By using this smart contract, supply chain participants can track the lifecycle of products, ensuring transparency and accountability throughout the supply chain.
