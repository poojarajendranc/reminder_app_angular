import { Injectable, signal } from '@angular/core';

export type AppLanguage = 'en' | 'fr';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  readonly currentLanguage = signal<AppLanguage>('en');

  readonly languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' }
  ] as const;

  initialize(): void {
    console.log('LanguageService initialize called');
  }

  changeLanguage(language: AppLanguage): void {
    this.currentLanguage.set(language);
  }
}
