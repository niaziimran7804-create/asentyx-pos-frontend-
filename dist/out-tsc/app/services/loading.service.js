import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
let LoadingService = class LoadingService {
    loadingSubject = new BehaviorSubject(false);
    loading$ = this.loadingSubject.asObservable();
    activeRequests = 0;
    show() {
        this.activeRequests++;
        if (this.activeRequests > 0) {
            this.loadingSubject.next(true);
        }
    }
    hide() {
        this.activeRequests--;
        if (this.activeRequests <= 0) {
            this.activeRequests = 0;
            this.loadingSubject.next(false);
        }
    }
    reset() {
        this.activeRequests = 0;
        this.loadingSubject.next(false);
    }
};
LoadingService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], LoadingService);
export { LoadingService };
//# sourceMappingURL=loading.service.js.map