import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../recipe.test-samples';

import { RecipeFormService } from './recipe-form.service';

describe('Recipe Form Service', () => {
  let service: RecipeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeFormService);
  });

  describe('Service methods', () => {
    describe('createRecipeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRecipeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            cookingTime: expect.any(Object),
            rate: expect.any(Object),
            imageUrl: expect.any(Object),
            creationDate: expect.any(Object),
            user: expect.any(Object),
            categorie: expect.any(Object),
            ingredient: expect.any(Object),
          })
        );
      });

      it('passing IRecipe should create a new form with FormGroup', () => {
        const formGroup = service.createRecipeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            cookingTime: expect.any(Object),
            rate: expect.any(Object),
            imageUrl: expect.any(Object),
            creationDate: expect.any(Object),
            user: expect.any(Object),
            categorie: expect.any(Object),
            ingredient: expect.any(Object),
          })
        );
      });
    });

    describe('getRecipe', () => {
      it('should return NewRecipe for default Recipe initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRecipeFormGroup(sampleWithNewData);

        const recipe = service.getRecipe(formGroup) as any;

        expect(recipe).toMatchObject(sampleWithNewData);
      });

      it('should return NewRecipe for empty Recipe initial value', () => {
        const formGroup = service.createRecipeFormGroup();

        const recipe = service.getRecipe(formGroup) as any;

        expect(recipe).toMatchObject({});
      });

      it('should return IRecipe', () => {
        const formGroup = service.createRecipeFormGroup(sampleWithRequiredData);

        const recipe = service.getRecipe(formGroup) as any;

        expect(recipe).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRecipe should not enable id FormControl', () => {
        const formGroup = service.createRecipeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRecipe should disable id FormControl', () => {
        const formGroup = service.createRecipeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
