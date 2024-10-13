import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '../../../services/translate.service';
import { TRANSLATE_API_URL } from '../constants/admin.constant';

@Injectable({
    providedIn: 'root'
})
export class Util {

    private debounceTimeout: any;
    private static _instance: Util;

    constructor(private translate: TranslateService, private http: HttpClient) {

    }


    getTranslateText(event: Event, marathiText: string): Observable<any> {
        const input = event.target as HTMLInputElement;
        let text = input.value;
        input.value = (text.trim() !== '') ? text : ' ';

        return new Observable((observer) => {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                if (text.trim() !== '') {
                    this.http.post(TRANSLATE_API_URL, {
                        q: text,
                        source: 'en',
                        target: 'mr',
                        format: 'text'
                    }).subscribe((res: any) => {
                        if (res && res.data && res.data.translations && res.data.translations.length > 0) {
                            marathiText = res.data.translations[0].translatedText;

                            setTimeout(() => {
                                this.updateText(marathiText, input);
                                observer.next(marathiText);
                                observer.complete();
                            }, 400);
                        } else {
                            observer.error('Unexpected API response format');
                        }
                    }, (err) => {
                        console.error('Translation API error:', err);
                        observer.error(err);
                    });
                } else {
                    marathiText = '';
                    this.updateText(marathiText, input);
                    observer.next(marathiText);
                    observer.complete();
                }
            }, 200);
        });
    }

    onKeydown(event: KeyboardEvent, controlName: string, formGroup: any): void {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default Enter key behavior
            const control = formGroup.get(controlName);
            const text = control.value;
            let translatedText = '';
            if (text && text.trim() !== '') {
                console.log('Translating:', text);
                clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(() => {
                    this.translate.translate(text).subscribe({
                        next: (res: any) => {
                            if (res && res.data && res.data.translations && res.data.translations.length > 0) {
                                translatedText = res.data.translations[0].translatedText;
                                this.updateText1(translatedText, control);
                            } else {
                                console.error('Unexpected API response format:', res);
                            }
                        },
                        error: (err) => {
                            console.error('Translation API error:', err);
                        },
                        complete: () => {
                            console.log('Translation completed');
                        }
                    });
                }, 200); // Adjust the debounce delay as per your requirement
            }
        }
    }


    private updateText(text: string, input: HTMLInputElement): void {
        input.value = text;
        input.dispatchEvent(new Event('input'));
    }

    private updateText1(text: string, control: any): void {
        control.setValue(text);
        control.updateValueAndValidity();
    }
}

export default Util;
