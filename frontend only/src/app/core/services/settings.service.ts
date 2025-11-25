import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { StoreSettings } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<StoreSettings | null>(null);
  public settings$ = this.settingsSubject.asObservable();

  private mockSettings: StoreSettings = {
    id: '1',
    storeName: 'Asentyx Supermarket',
    storeAddress: '123 Business Street, City, State 12345',
    storePhone: '+1 (555) 123-4567',
    storeEmail: 'info@asentyxmart.com',
    logoUrl: 'https://via.placeholder.com/200?text=Asentyx+POS',
    currency: 'USD',
    taxRate: 10,
    defaultDiscountPolicy: 'Discounts must not exceed product-specific limits',
    receiptHeader: 'Thank you for shopping with us!',
    receiptFooter: 'Visit us again soon!',
    theme: 'light'
  };

  constructor() {
    this.loadSettings();
  }

  getSettings(): Observable<StoreSettings> {
    return of(this.mockSettings).pipe(delay(300));
  }

  updateSettings(updates: Partial<StoreSettings>): Observable<StoreSettings> {
    return of(null).pipe(
      delay(500),
      map(() => {
        this.mockSettings = {
          ...this.mockSettings,
          ...updates
        };
        this.settingsSubject.next(this.mockSettings);
        localStorage.setItem('store_settings', JSON.stringify(this.mockSettings));
        return this.mockSettings;
      })
    );
  }

  updateTheme(theme: 'light' | 'dark'): Observable<StoreSettings> {
    return this.updateSettings({ theme });
  }

  uploadLogo(file: File): Observable<string> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const logoUrl = 'https://via.placeholder.com/200?text=New+Logo';
        this.updateSettings({ logoUrl });
        return logoUrl;
      })
    );
  }

  private loadSettings(): void {
    const savedSettings = localStorage.getItem('store_settings');
    if (savedSettings) {
      try {
        this.mockSettings = JSON.parse(savedSettings);
        this.settingsSubject.next(this.mockSettings);
      } catch (e) {
        this.settingsSubject.next(this.mockSettings);
      }
    } else {
      this.settingsSubject.next(this.mockSettings);
    }
  }
}
