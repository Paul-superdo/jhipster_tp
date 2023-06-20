import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ingredient.test-samples';

import { IngredientFormService } from './ingredient-form.service';

describe('Ingredient Form Service', () => {
  let service: IngredientFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientFormService);
  });

  describe('Service methods', () => {
    describe('createIngredientFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createIngredientFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            portions: expect.any(Object),
            creationDate: expect.any(Object),
            recipe: expect.any(Object),
          })
        );
      });

      it('passing IIngredient should create a new form with FormGroup', () => {
        const formGroup = service.createIngredientFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            portions: expect.any(Object),
            creationDate: expect.any(Object),
            recipe: expect.any(Object),
          })
        );
      });
    });

    describe('getIngredient', () => {
      it('should return NewIngredient for default Ingredient initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createIngredientFormGroup(sampleWithNewData);

        const ingredient = service.getIngredient(formGroup) as any;

        expect(ingredient).toMatchObject(sampleWithNewData);
      });

      it('should return NewIngredient for empty Ingredient initial value', () => {
        const formGroup = service.createIngredientFormGroup();

        const ingredient = service.getIngredient(formGroup) as any;

        expect(ingredient).toMatchObject({});
      });

      it('should return IIngredient', () => {
        const formGroup = service.createIngredientFormGroup(sampleWithRequiredData);

        const ingredient = service.getIngredient(formGroup) as any;

        expect(ingredient).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IIngredient should not enable id FormControl', () => {
        const formGroup = service.createIngredientFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewIngredient should disable id FormControl', () => {
        const formGroup = service.createIngredientFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
