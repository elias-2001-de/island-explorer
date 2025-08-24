// error-handler.service.ts
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    handleError(error: any): void {
        // Fehler normal loggen
        console.error('Angular Error:', error);

        // Fehler an Parent-Fenster schicken
        window.parent.postMessage({
            type: 'ANGULAR_ERROR',
            message: error?.message || error.toString(),
            stack: error?.stack || null
        }, '*'); // besser hier die genaue Domain statt '*'
    }
}
