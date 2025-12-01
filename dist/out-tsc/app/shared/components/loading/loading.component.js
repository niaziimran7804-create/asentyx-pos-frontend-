import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
let LoadingComponent = class LoadingComponent {
    loadingService;
    constructor(loadingService) {
        this.loadingService = loadingService;
    }
};
LoadingComponent = __decorate([
    Component({
        selector: 'app-loading',
        standalone: true,
        imports: [CommonModule],
        template: `
    <div *ngIf="loadingService.loading$ | async" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-white fw-semibold">Processing...</p>
      </div>
    </div>
  `,
        styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(5px);
    }

    .loading-spinner {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .spinner-border {
      width: 3rem;
      height: 3rem;
      border-width: 0.3rem;
    }

    p {
      margin: 0;
      font-size: 1.1rem;
    }
  `]
    })
], LoadingComponent);
export { LoadingComponent };
//# sourceMappingURL=loading.component.js.map