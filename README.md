````markdown
# Package Tracking Frontend

## Overview

The **Package Tracking Frontend** is an Angular-based web application that provides users with real-time tracking information for their packages. Users can enter their tracking IDs, view delivery statuses, and access detailed tracking information like a map view of the current location of th product.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Functionalities](#functionalities)
- [Security Measures](#security-measures)
- [Best Practices](#best-practices)
  - [Readability and Clarity](#readability-and-clarity)
  - [Maintainability](#maintainability)
  - [Efficiency](#efficiency)
  - [Reliability](#reliability)
  - [Reusability](#reusability)
  - [Scalability](#scalability)
  - [Compliance with Standards](#compliance-with-standards)
  - [Documentation](#documentation)

## Features

- Intuitive interface for tracking packages.
- Real-time delivery status updates.
- Comprehensive tracking info such as map view of the current location of the package.

## Getting Started

To begin working with the Package Tracking Frontend, ensure you have the following prerequisites installed:

- **Node.js** (version 14.x or higher)
- **Angular CLI** (version 18.x or higher)

## Running the Application

Follow these steps to run the application locally:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/package-tracking-frontend.git
   git checkout fe
   cd package-tracking-frontend
   ```
````

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Start the Application:**

   ```bash
   ng serve
   ```

   The application will be accessible at `http://localhost:4200/`.

For API documentation, visit: [Postman API Docs](https://www.postman.com/chixcom/package-tracking/documentation/m2cm12x/backend-api?workspaceId=fe7c8bc0-351d-4aa7-94fe-76fa822fdf76)

## Functionalities

- **Track Package**: Users can enter their tracking ID to receive real-time location updates on their package status.
- **View Status**: Displays the current status of the package (e.g., "In Transit", "Delivered", "Pending") along with a map view of the current location.
- **Create Package, Delivery, and Tracking**:
  - A customer can enter a package ID to track it. The application uses REST APIs to fetch the package details. If there is an active delivery, a WebSocket connection is established to listen for delivery update events, displaying the package and delivery details on a map with the source, destination, and current location.
  - A driver can enter a delivery ID to load their delivery. The application fetches the delivery and package details using REST APIs, utilizing the browser's location API to display the current location on the map along with the package's source and destination. The browser location is updated every 20 seconds to send delivery location updates via WebSocket.

## Security Measures

- **Input Validation**: Ensure all user inputs are validated to prevent injection attacks.
- **HTTPS**: The application should be served over HTTPS to encrypt data in transit.
- **CORS**: Implement proper Cross-Origin Resource Sharing (CORS) settings for secure interactions with backend services.
- **Environment Variables**: Store sensitive information like API keys in environment variables rather than hardcoding them into the application.

## Best Practices

### Readability and Clarity

- Code is written with clear naming conventions and comments to facilitate understanding for other developers.

### Maintainability

- The codebase is organized into modules, components, and services that adhere to Angular best practices, making it easy to maintain.

### Efficiency

- The application uses lazy loading for modules to enhance performance and reduce initial loading time.

### Reliability

- Thorough testing is conducted to ensure consistent performance and accurate data handling.

### Reusability

- Components are designed to be reusable across the application, promoting the DRY (Don't Repeat Yourself) principle.

### Scalability

- The application structure allows for easy scaling, enabling the addition of new features and components without affecting existing functionality.

### Compliance with Standards

- The application adheres to industry standards and best practices for web development, including accessibility and user experience.

### Documentation

- Comprehensive documentation is provided to assist developers and users in understanding the application and its functionalities.

## Conclusion

The Package Tracking Frontend is designed to deliver a seamless user experience while adhering to best practices in software development.

---

**Author:** Chibuikem Prince Chisomaga  
**License:** MIT License  
**Repository:** [GitHub Repository](https://github.com/chibuikemprince/package_tracker_gozem.git)

```

```
