import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'ingredient',
        data: { pageTitle: 'myApp.ingredient.home.title' },
        loadChildren: () => import('./ingredient/ingredient.routes'),
      },
      {
        path: 'categorie',
        data: { pageTitle: 'myApp.categorie.home.title' },
        loadChildren: () => import('./categorie/categorie.routes'),
      },
      {
        path: 'recipe',
        data: { pageTitle: 'myApp.recipe.home.title' },
        loadChildren: () => import('./recipe/recipe.routes'),
      },
      {
        path: 'comment',
        data: { pageTitle: 'myApp.comment.home.title' },
        loadChildren: () => import('./comment/comment.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
