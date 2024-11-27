import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { inject } from '@angular/core';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ManageServerAuthService } from '../../service/server/manageServerAuth.service';
import { ServerService } from '../../service/server/serverService';

export const manageServerAuthGuard: CanActivateFn = (route, state) => {
  var userService = inject(UserService);
  var manageServerAuthService = inject(ManageServerAuthService);
  var serverService = inject(ServerService);
  var router = inject(Router);

  var ip = route.paramMap.get('ip');
  if (!ip) {
    if(route.parent){
      ip = route.parent!.paramMap.get('ip');
      if(!ip){
        return of(false);
      }
    }
    else{
      return of(false);
    }
  }
  
  return userService.getUser().pipe(
    mergeMap(user => {
      if (!user) {
        router.navigate(['/auth/signIn']);
        return of(false);
      }

      return serverService.getServer(ip!).pipe(
        map(server => {
          if (!server) {
            return false;
          }
          
          const isAllowed = manageServerAuthService.hasPermission(route.routeConfig?.path ?? "", server.role);
          if(!isAllowed){
            router.navigate(['/server/', ip]);
            return false;
          }

          return isAllowed;
        }),
        catchError(() => of(false))
      );
    }),
    catchError(() => of(false))
  );
};
