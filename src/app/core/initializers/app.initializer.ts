// Task 3: Implement this APP_INITIALIZER.
// It should:
// 1. Load /assets/config/app.config.json via HttpClient
// 2. Call AppConfigService.set(config) to store the loaded config
// 3. Set document.documentElement dir and lang attributes from config
// 4. Load /assets/config/payments/{config.country}.json
// 5. Call PaymentConfigService.setProviders(paymentConfig.providers)
// 6. Call TranslateService.use(config.lang)
// 7. Return an Observable<void>
//
// Register it in app.config.ts:
// {
//   provide: APP_INITIALIZER,
//   useFactory: appInitializer,
//   multi: true,
//   deps: []
// }
