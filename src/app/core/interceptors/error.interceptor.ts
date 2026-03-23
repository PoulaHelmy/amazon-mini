// Task 3: Implement this HTTP interceptor.
// It should catch HTTP errors and show user-friendly notifications.
// - 401: redirect to login or show "Session expired"
// - 404: show "Resource not found"
// - 500: show "Server error, please try again"
// Use PrimeNG MessageService or a custom toast.
//
// Register in app.config.ts using withInterceptors([errorInterceptor]).
