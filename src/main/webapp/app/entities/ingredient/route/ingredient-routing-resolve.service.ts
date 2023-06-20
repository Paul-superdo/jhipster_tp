import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIngredient } from '../ingredient.model';
import { IngredientService } from '../service/ingredient.service';

export const ingredientResolve = (route: ActivatedRouteSnapshot): Observable<null | IIngredient> => {
  const id = route.params['id'];
  if (id) {
    return inject(IngredientService)
      .find(id)
      .pipe(
        mergeMap((ingredient: HttpResponse<IIngredient>) => {
          if (ingredient.body) {
            return of(ingredient.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default ingredientResolve;
