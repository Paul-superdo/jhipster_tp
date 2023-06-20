import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IIngredient, NewIngredient } from '../ingredient.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IIngredient for edit and NewIngredientFormGroupInput for create.
 */
type IngredientFormGroupInput = IIngredient | PartialWithRequiredKeyOf<NewIngredient>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IIngredient | NewIngredient> = Omit<T, 'creationDate'> & {
  creationDate?: string | null;
};

type IngredientFormRawValue = FormValueOf<IIngredient>;

type NewIngredientFormRawValue = FormValueOf<NewIngredient>;

type IngredientFormDefaults = Pick<NewIngredient, 'id' | 'creationDate'>;

type IngredientFormGroupContent = {
  id: FormControl<IngredientFormRawValue['id'] | NewIngredient['id']>;
  name: FormControl<IngredientFormRawValue['name']>;
  description: FormControl<IngredientFormRawValue['description']>;
  portions: FormControl<IngredientFormRawValue['portions']>;
  creationDate: FormControl<IngredientFormRawValue['creationDate']>;
  recipe: FormControl<IngredientFormRawValue['recipe']>;
};

export type IngredientFormGroup = FormGroup<IngredientFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class IngredientFormService {
  createIngredientFormGroup(ingredient: IngredientFormGroupInput = { id: null }): IngredientFormGroup {
    const ingredientRawValue = this.convertIngredientToIngredientRawValue({
      ...this.getFormDefaults(),
      ...ingredient,
    });
    return new FormGroup<IngredientFormGroupContent>({
      id: new FormControl(
        { value: ingredientRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(ingredientRawValue.name),
      description: new FormControl(ingredientRawValue.description),
      portions: new FormControl(ingredientRawValue.portions),
      creationDate: new FormControl(ingredientRawValue.creationDate),
      recipe: new FormControl(ingredientRawValue.recipe),
    });
  }

  getIngredient(form: IngredientFormGroup): IIngredient | NewIngredient {
    return this.convertIngredientRawValueToIngredient(form.getRawValue() as IngredientFormRawValue | NewIngredientFormRawValue);
  }

  resetForm(form: IngredientFormGroup, ingredient: IngredientFormGroupInput): void {
    const ingredientRawValue = this.convertIngredientToIngredientRawValue({ ...this.getFormDefaults(), ...ingredient });
    form.reset(
      {
        ...ingredientRawValue,
        id: { value: ingredientRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): IngredientFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      creationDate: currentTime,
    };
  }

  private convertIngredientRawValueToIngredient(
    rawIngredient: IngredientFormRawValue | NewIngredientFormRawValue
  ): IIngredient | NewIngredient {
    return {
      ...rawIngredient,
      creationDate: dayjs(rawIngredient.creationDate, DATE_TIME_FORMAT),
    };
  }

  private convertIngredientToIngredientRawValue(
    ingredient: IIngredient | (Partial<NewIngredient> & IngredientFormDefaults)
  ): IngredientFormRawValue | PartialWithRequiredKeyOf<NewIngredientFormRawValue> {
    return {
      ...ingredient,
      creationDate: ingredient.creationDate ? ingredient.creationDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
