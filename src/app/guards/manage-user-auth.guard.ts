import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { mergeMap, of } from 'rxjs';

export const manageUserAuthGuard: CanActivateFn = (route, state) => {
  var userService = inject(UserService);
  var router = inject(Router);

  return userService.getUser().pipe(
    mergeMap(
      (user) => {
        if (user) {
          return of(true);
        }
        else {
          router.navigate(['/auth/signIn']);
          return of(false);
        }
      }
    )
  )
};
