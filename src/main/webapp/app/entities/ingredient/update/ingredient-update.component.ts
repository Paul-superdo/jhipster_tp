import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IngredientFormService, IngredientFormGroup } from './ingredient-form.service';
import { IIngredient } from '../ingredient.model';
import { IngredientService } from '../service/ingredient.service';
import { IRecipe } from 'app/entities/recipe/recipe.model';
import { RecipeService } from 'app/entities/recipe/service/recipe.service';

@Component({
  standalone: true,
  selector: 'jhi-ingredient-update',
  templateUrl: './ingredient-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class IngredientUpdateComponent implements OnInit {
  isSaving = false;
  ingredient: IIngredient | null = null;

  recipesSharedCollection: IRecipe[] = [];

  editForm: IngredientFormGroup = this.ingredientFormService.createIngredientFormGroup();

  constructor(
    protected ingredientService: IngredientService,
    protected ingredientFormService: IngredientFormService,
    protected recipeService: RecipeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRecipe = (o1: IRecipe | null, o2: IRecipe | null): boolean => this.recipeService.compareRecipe(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ingredient }) => {
      this.ingredient = ingredient;
      if (ingredient) {
        this.updateForm(ingredient);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ingredient = this.ingredientFormService.getIngredient(this.editForm);
    if (ingredient.id !== null) {
      this.subscribeToSaveResponse(this.ingredientService.update(ingredient));
    } else {
      this.subscribeToSaveResponse(this.ingredientService.create(ingredient));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIngredient>>): void {
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

  protected updateForm(ingredient: IIngredient): void {
    this.ingredient = ingredient;
    this.ingredientFormService.resetForm(this.editForm, ingredient);

    this.recipesSharedCollection = this.recipeService.addRecipeToCollectionIfMissing<IRecipe>(
      this.recipesSharedCollection,
      ingredient.recipe
    );
  }

  protected loadRelationshipsOptions(): void {
    this.recipeService
      .query()
      .pipe(map((res: HttpResponse<IRecipe[]>) => res.body ?? []))
      .pipe(map((recipes: IRecipe[]) => this.recipeService.addRecipeToCollectionIfMissing<IRecipe>(recipes, this.ingredient?.recipe)))
      .subscribe((recipes: IRecipe[]) => (this.recipesSharedCollection = recipes));
  }
}
