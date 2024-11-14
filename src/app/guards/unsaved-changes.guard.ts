import { CanDeactivateFn } from '@angular/router';

export const unsavedChangesGuard: CanDeactivateFn<unknown> = (component: any, currentRoute, currentState, nextState) => {
  if(component.canDeactivate){
    return component.canDeactivate();
  }

  return true;
};
