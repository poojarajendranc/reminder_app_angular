import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'en' | 'fr';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly translateService = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentLanguage = signal<AppLanguage>('en');

  readonly languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' }
  ] as const;

  initialize(): void {
    // `langs`, `lang` and `fallbackLang` are already provided declaratively
    // in app.config.ts. Calling `use('en')` again here just re-enters the
    // loading pipeline for no benefit — skip it on the server entirely.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const saved = this.getStoredLanguage();
    const initial = saved ?? 'en';
    this.translateService.use(initial);
    this.currentLanguage.set(initial);
  }

  changeLanguage(language: AppLanguage): void {
    this.translateService.use(language);
    this.currentLanguage.set(language);
    this.storeLanguage(language);
  }

  private getStoredLanguage(): AppLanguage | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    try {
      const value = localStorage.getItem('lang');
      return value === 'en' || value === 'fr' ? value : null;
    } catch {
      return null;
    }
  }

  private storeLanguage(language: AppLanguage): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    try {
      localStorage.setItem('lang', language);
    } catch {
      // Storage unavailable (private mode, etc.) — language stays session-only.
    }
  }
}
