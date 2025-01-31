import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ApiService } from '../../../services/api.service';
import { TranslateService } from '../../../services/translate.service';
import { API_URL, ITEM_PER_PAGE, TRANSLATE_API_URL } from '../constants/admin.constant';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class Util {

    private debounceTimeout: any;
    private static _instance: Util;

    constructor(private translate: TranslateService, private http: HttpClient, private api: ApiService) {

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

    getSerialNumber(index: number, currentPage: number): number {
        return (currentPage - 1) * ITEM_PER_PAGE + index + 1;
    }


    async showConfirmAlert(): Promise<boolean> {
        return Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            return result.isConfirmed;
        });
    }

    async showAlertMessage(msg: string, title: string, type: 'success' | 'error' | 'warning' | 'info' | 'question'): Promise<boolean> {
        const result = await Swal.fire({
            title: title,
            text: msg,
            icon: type,
            confirmButtonText: 'OK'
        });
        return result.isConfirmed;
    }
    


    async getDistrictDDL(url: string = "district-list-ddl") {
        const cacheKey = 'districts';
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };
            const res: any = await this.http.post(`${API_URL}${url}`, {}, { headers }).toPromise();
            const data = res?.data ?? [];
            localStorage.setItem(cacheKey, JSON.stringify(data));
            return data;
        } catch (err) {
            console.error('Error getting districts:', err);
            return [];
        }
    }

    async getMalmattechePrakartDDL(url: string = "get-malmatteche-prakar-all-list") {
        const cacheKey = 'malmatteche-prakar';
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };
            const res: any = await this.http.post(`${API_URL}${url}`, {}, { headers }).toPromise();
            const data = res?.data ?? [];
            localStorage.setItem(cacheKey, JSON.stringify(data));
            return data;
        } catch (err) {
            console.error('Error getting malmatteche prakar:', err);
            return [];
        }
    }
    async getTalukaById(params: any) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };

        return await this.http.post(`${API_URL}taluka-list-by-district-id`, params, { headers }).toPromise();

    }
    async getGatGramTalukaById(params: any) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
        return await this.http.post(`${API_URL}panchayat-list-by-taluka-id`, params, { headers }).toPromise();
    }
    

    // check only integer entered
    async validateInteger(input: any): Promise<boolean> {
        // const parsedInput = Number(input);
        // if (isNaN(parsedInput) || !Number.isInteger(parsedInput)) {
        //     return false;
        // }
        return true; 
    }

    // accept only decimal digit
    async validateFloat(input: any): Promise<boolean> {
        // const parsedInput = parseFloat(input); // Try to parse the input as a float
        // if (isNaN(parsedInput) || !input.includes('.') || parsedInput === Math.floor(parsedInput)) {
        //     return false;
        // }
        return true;
    }

    async validateString(input: any): Promise<boolean> {
        // if (typeof input !== 'string' || input.trim() === '') {
        //     return false;
        // }
        return true;
    }

    async validateStringWithSpaces(input: any): Promise<boolean> {
        // Regular Expression to allow only letters and spaces
        // const stringPattern = /^[a-zA-Z\s]*$/;

        // if (!stringPattern.test(input)) {
        //     return true;
        // } 
        return true;
  }
}


export function onlyStringAndSpacesValidator(control: AbstractControl): ValidationErrors | null {
  // Allow spaces and letters only (regular expression)
//   const regex = /^[A-Za-z\s]*$/;
//   if (control.value && !regex.test(control.value)) {
//     return { 'invalidInput': true };  // Returns error if invalid characters are found
//   }
  return null;  // No error if input is valid
}



export default Util;
