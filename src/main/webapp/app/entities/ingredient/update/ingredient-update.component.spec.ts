import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IngredientFormService } from './ingredient-form.service';
import { IngredientService } from '../service/ingredient.service';
import { IIngredient } from '../ingredient.model';
import { IRecipe } from 'app/entities/recipe/recipe.model';
import { RecipeService } from 'app/entities/recipe/service/recipe.service';

import { IngredientUpdateComponent } from './ingredient-update.component';

describe('Ingredient Management Update Component', () => {
  let comp: IngredientUpdateComponent;
  let fixture: ComponentFixture<IngredientUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ingredientFormService: IngredientFormService;
  let ingredientService: IngredientService;
  let recipeService: RecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), IngredientUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(IngredientUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IngredientUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ingredientFormService = TestBed.inject(IngredientFormService);
    ingredientService = TestBed.inject(IngredientService);
    recipeService = TestBed.inject(RecipeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Recipe query and add missing value', () => {
      const ingredient: IIngredient = { id: 456 };
      const recipe: IRecipe = { id: 85896 };
      ingredient.recipe = recipe;

      const recipeCollection: IRecipe[] = [{ id: 66744 }];
      jest.spyOn(recipeService, 'query').mockReturnValue(of(new HttpResponse({ body: recipeCollection })));
      const additionalRecipes = [recipe];
      const expectedCollection: IRecipe[] = [...additionalRecipes, ...recipeCollection];
      jest.spyOn(recipeService, 'addRecipeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      expect(recipeService.query).toHaveBeenCalled();
      expect(recipeService.addRecipeToCollectionIfMissing).toHaveBeenCalledWith(
        recipeCollection,
        ...additionalRecipes.map(expect.objectContaining)
      );
      expect(comp.recipesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ingredient: IIngredient = { id: 456 };
      const recipe: IRecipe = { id: 25987 };
      ingredient.recipe = recipe;

      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      expect(comp.recipesSharedCollection).toContain(recipe);
      expect(comp.ingredient).toEqual(ingredient);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIngredient>>();
      const ingredient = { id: 123 };
      jest.spyOn(ingredientFormService, 'getIngredient').mockReturnValue(ingredient);
      jest.spyOn(ingredientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ingredient }));
      saveSubject.complete();

      // THEN
      expect(ingredientFormService.getIngredient).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ingredientService.update).toHaveBeenCalledWith(expect.objectContaining(ingredient));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIngredient>>();
      const ingredient = { id: 123 };
      jest.spyOn(ingredientFormService, 'getIngredient').mockReturnValue({ id: null });
      jest.spyOn(ingredientService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredient: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ingredient }));
      saveSubject.complete();

      // THEN
      expect(ingredientFormService.getIngredient).toHaveBeenCalled();
      expect(ingredientService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIngredient>>();
      const ingredient = { id: 123 };
      jest.spyOn(ingredientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ingredientService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRecipe', () => {
      it('Should forward to recipeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(recipeService, 'compareRecipe');
        comp.compareRecipe(entity, entity2);
        expect(recipeService.compareRecipe).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
