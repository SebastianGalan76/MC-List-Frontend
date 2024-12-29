import { Injectable } from '@angular/core';
import { Banner } from '../model/banner';
import { ApiService } from './api.service';
import { catchError, map, Observable, of } from 'rxjs';
import { ObjectResponse } from '../model/response/ObjectResponse';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  userBanners: Banner[] | null = null;

  banners: Banner[] | null = null;

  constructor(private apiService: ApiService) {

  }

  public getBanners(): Observable<Banner[]> {
    if (this.banners) {
      return of(this.banners);
    }

    return this.apiService.get<ObjectResponse<Banner[]>>('/banners', {}).pipe(
      map(data => {
        this.banners = data.object;
        return data.object;
      }),
      catchError(error => {
        console.error('Błąd pobierania banerów', error);
        return of([]);
      }));
  }

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
