import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
let LoadingInterceptor = class LoadingInterceptor {
    loadingService;
    constructor(loadingService) {
        this.loadingService = loadingService;
    }
    intercept(request, next) {
        // Show loader when request starts
        this.loadingService.show();
        return next.handle(request).pipe(finalize(() => {
            // Hide loader when request completes (success or error)
            this.loadingService.hide();
        }));
    }
};
LoadingInterceptor = __decorate([
    Injectable()
], LoadingInterceptor);
export { LoadingInterceptor };
//# sourceMappingURL=loading.interceptor.js.map