// token.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { LoadingService } from './spinner.service';
import { Route, Router } from '@angular/router';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService, 
    private router: Router) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.loadingService.show();
      const token = localStorage.getItem('token');
      console.log(req)
      
      if (token) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(cloned).pipe(
          finalize(() => {
            this.loadingService.hide()
          }),
          catchError((error: HttpErrorResponse) => {
            
            this.showError(error);
            // this.spinnerService.hide();
            return throwError(error);
          })
        );
      }
      return next.handle(req).pipe(
        finalize(() => {
          this.loadingService.hide()
        })
      );
    }
    
    showError(error: HttpErrorResponse): void{
      switch(error?.status){
        
        case 401: //Unauthorized
        // case 405:
        this.router.navigate(['admin/login']).then();
        
        break;
      }
      
    }
  }
  