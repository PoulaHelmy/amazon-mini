// Task 3: Implement this route resolver for the products/:id route.
// It should pre-fetch the product by ID from /assets/data/products.json
// before the ProductDetailComponent activates.
// Return the Product | null via ResolveFn<Product | null>.
//
// Register in app.routes.ts:
// {
//   path: 'products/:id',
//   resolve: { product: productResolver },
//   loadComponent: ...
// }
