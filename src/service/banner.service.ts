import { Injectable } from '@angular/core';
import { Banner } from '../model/banner';
import { ApiService } from './api.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  userBanners: Banner[] | null = null;

  constructor(private apiService: ApiService) {}

  public getUserBanners(): Observable<Banner[]> {
    if (this.userBanners) {
      return of(this.userBanners);
    }

    return this.apiService.get<Banner[]>("/user/banners", { withCredentials: true }).pipe(
      map(data => {
        if (data) {
          this.userBanners = data;
          return data;
        }
        else {
          return [];
        }
      }),
      catchError(error => {
        console.error('Błąd pobierania banerów', error);
        return of([]);
      }));
  }

  public addBanner(banner: Banner) {
    if (this.userBanners) {
      this.userBanners.push(banner);
    }
  }
}
