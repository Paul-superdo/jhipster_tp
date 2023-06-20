import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IngredientComponent } from './list/ingredient.component';
import { IngredientDetailComponent } from './detail/ingredient-detail.component';
import { IngredientUpdateComponent } from './update/ingredient-update.component';
import IngredientResolve from './route/ingredient-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const ingredientRoute: Routes = [
  {
    path: '',
    component: IngredientComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IngredientDetailComponent,
    resolve: {
      ingredient: IngredientResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IngredientUpdateComponent,
    resolve: {
      ingredient: IngredientResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IngredientUpdateComponent,
    resolve: {
      ingredient: IngredientResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ingredientRoute;
