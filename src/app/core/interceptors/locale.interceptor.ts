// Task 3: Implement this HTTP interceptor.
// It should clone every outgoing request and add headers:
//   - Accept-Language: <config.lang>
//   - X-Country: <config.country>
// The values should come from AppConfigService.get().
//
// Register in app.config.ts using withInterceptors([localeInterceptor]).
