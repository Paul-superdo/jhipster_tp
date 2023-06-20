import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RecipeFormService, RecipeFormGroup } from './recipe-form.service';
import { IRecipe } from '../recipe.model';
import { RecipeService } from '../service/recipe.service';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';
import { IngredientService } from 'app/entities/ingredient/service/ingredient.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICategorie } from 'app/entities/categorie/categorie.model';
import { CategorieService } from 'app/entities/categorie/service/categorie.service';

@Component({
  standalone: true,
  selector: 'jhi-recipe-update',
  templateUrl: './recipe-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RecipeUpdateComponent implements OnInit {
  isSaving = false;
  recipe: IRecipe | null = null;

  ingredientsSharedCollection: IIngredient[] = [];
  usersSharedCollection: IUser[] = [];
  categoriesSharedCollection: ICategorie[] = [];

  editForm: RecipeFormGroup = this.recipeFormService.createRecipeFormGroup();

  constructor(
    protected recipeService: RecipeService,
    protected recipeFormService: RecipeFormService,
    protected ingredientService: IngredientService,
    protected userService: UserService,
    protected categorieService: CategorieService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareIngredient = (o1: IIngredient | null, o2: IIngredient | null): boolean => this.ingredientService.compareIngredient(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareCategorie = (o1: ICategorie | null, o2: ICategorie | null): boolean => this.categorieService.compareCategorie(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recipe }) => {
      this.recipe = recipe;
      if (recipe) {
        this.updateForm(recipe);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const recipe = this.recipeFormService.getRecipe(this.editForm);
    if (recipe.id !== null) {
      this.subscribeToSaveResponse(this.recipeService.update(recipe));
    } else {
      this.subscribeToSaveResponse(this.recipeService.create(recipe));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecipe>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(recipe: IRecipe): void {
    this.recipe = recipe;
    this.recipeFormService.resetForm(this.editForm, recipe);

    this.ingredientsSharedCollection = this.ingredientService.addIngredientToCollectionIfMissing<IIngredient>(
      this.ingredientsSharedCollection,
      recipe.ingredient
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, recipe.user);
    this.categoriesSharedCollection = this.categorieService.addCategorieToCollectionIfMissing<ICategorie>(
      this.categoriesSharedCollection,
      recipe.categorie
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ingredientService
      .query()
      .pipe(map((res: HttpResponse<IIngredient[]>) => res.body ?? []))
      .pipe(
        map((ingredients: IIngredient[]) =>
          this.ingredientService.addIngredientToCollectionIfMissing<IIngredient>(ingredients, this.recipe?.ingredient)
        )
      )
      .subscribe((ingredients: IIngredient[]) => (this.ingredientsSharedCollection = ingredients));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.recipe?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.categorieService
      .query()
      .pipe(map((res: HttpResponse<ICategorie[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategorie[]) =>
          this.categorieService.addCategorieToCollectionIfMissing<ICategorie>(categories, this.recipe?.categorie)
        )
      )
      .subscribe((categories: ICategorie[]) => (this.categoriesSharedCollection = categories));
  }
}
