import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IRecipe, NewRecipe } from '../recipe.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRecipe for edit and NewRecipeFormGroupInput for create.
 */
type RecipeFormGroupInput = IRecipe | PartialWithRequiredKeyOf<NewRecipe>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IRecipe | NewRecipe> = Omit<T, 'creationDate'> & {
  creationDate?: string | null;
};

type RecipeFormRawValue = FormValueOf<IRecipe>;

type NewRecipeFormRawValue = FormValueOf<NewRecipe>;

type RecipeFormDefaults = Pick<NewRecipe, 'id' | 'creationDate'>;

type RecipeFormGroupContent = {
  id: FormControl<RecipeFormRawValue['id'] | NewRecipe['id']>;
  title: FormControl<RecipeFormRawValue['title']>;
  description: FormControl<RecipeFormRawValue['description']>;
  cookingTime: FormControl<RecipeFormRawValue['cookingTime']>;
  rate: FormControl<RecipeFormRawValue['rate']>;
  imageUrl: FormControl<RecipeFormRawValue['imageUrl']>;
  creationDate: FormControl<RecipeFormRawValue['creationDate']>;
  user: FormControl<RecipeFormRawValue['user']>;
  categorie: FormControl<RecipeFormRawValue['categorie']>;
  ingredient: FormControl<RecipeFormRawValue['ingredient']>;
};

export type RecipeFormGroup = FormGroup<RecipeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RecipeFormService {
  createRecipeFormGroup(recipe: RecipeFormGroupInput = { id: null }): RecipeFormGroup {
    const recipeRawValue = this.convertRecipeToRecipeRawValue({
      ...this.getFormDefaults(),
      ...recipe,
    });
    return new FormGroup<RecipeFormGroupContent>({
      id: new FormControl(
        { value: recipeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(recipeRawValue.title),
      description: new FormControl(recipeRawValue.description),
      cookingTime: new FormControl(recipeRawValue.cookingTime),
      rate: new FormControl(recipeRawValue.rate),
      imageUrl: new FormControl(recipeRawValue.imageUrl),
      creationDate: new FormControl(recipeRawValue.creationDate),
      user: new FormControl(recipeRawValue.user),
      categorie: new FormControl(recipeRawValue.categorie),
      ingredient: new FormControl(recipeRawValue.ingredient),
    });
  }

  getRecipe(form: RecipeFormGroup): IRecipe | NewRecipe {
    return this.convertRecipeRawValueToRecipe(form.getRawValue() as RecipeFormRawValue | NewRecipeFormRawValue);
  }

  resetForm(form: RecipeFormGroup, recipe: RecipeFormGroupInput): void {
    const recipeRawValue = this.convertRecipeToRecipeRawValue({ ...this.getFormDefaults(), ...recipe });
    form.reset(
      {
        ...recipeRawValue,
        id: { value: recipeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RecipeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      creationDate: currentTime,
    };
  }

  private convertRecipeRawValueToRecipe(rawRecipe: RecipeFormRawValue | NewRecipeFormRawValue): IRecipe | NewRecipe {
    return {
      ...rawRecipe,
      creationDate: dayjs(rawRecipe.creationDate, DATE_TIME_FORMAT),
    };
  }

  private convertRecipeToRecipeRawValue(
    recipe: IRecipe | (Partial<NewRecipe> & RecipeFormDefaults)
  ): RecipeFormRawValue | PartialWithRequiredKeyOf<NewRecipeFormRawValue> {
    return {
      ...recipe,
      creationDate: recipe.creationDate ? recipe.creationDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
