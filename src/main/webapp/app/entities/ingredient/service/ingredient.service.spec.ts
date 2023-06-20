import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IIngredient } from '../ingredient.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../ingredient.test-samples';

import { IngredientService, RestIngredient } from './ingredient.service';

const requireRestSample: RestIngredient = {
  ...sampleWithRequiredData,
  creationDate: sampleWithRequiredData.creationDate?.toJSON(),
};

describe('Ingredient Service', () => {
  let service: IngredientService;
  let httpMock: HttpTestingController;
  let expectedResult: IIngredient | IIngredient[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IngredientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Ingredient', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ingredient = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ingredient).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Ingredient', () => {
      const ingredient = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ingredient).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Ingredient', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Ingredient', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Ingredient', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addIngredientToCollectionIfMissing', () => {
      it('should add a Ingredient to an empty array', () => {
        const ingredient: IIngredient = sampleWithRequiredData;
        expectedResult = service.addIngredientToCollectionIfMissing([], ingredient);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ingredient);
      });

      it('should not add a Ingredient to an array that contains it', () => {
        const ingredient: IIngredient = sampleWithRequiredData;
        const ingredientCollection: IIngredient[] = [
          {
            ...ingredient,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addIngredientToCollectionIfMissing(ingredientCollection, ingredient);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Ingredient to an array that doesn't contain it", () => {
        const ingredient: IIngredient = sampleWithRequiredData;
        const ingredientCollection: IIngredient[] = [sampleWithPartialData];
        expectedResult = service.addIngredientToCollectionIfMissing(ingredientCollection, ingredient);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ingredient);
      });

      it('should add only unique Ingredient to an array', () => {
        const ingredientArray: IIngredient[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ingredientCollection: IIngredient[] = [sampleWithRequiredData];
        expectedResult = service.addIngredientToCollectionIfMissing(ingredientCollection, ...ingredientArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ingredient: IIngredient = sampleWithRequiredData;
        const ingredient2: IIngredient = sampleWithPartialData;
        expectedResult = service.addIngredientToCollectionIfMissing([], ingredient, ingredient2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ingredient);
        expect(expectedResult).toContain(ingredient2);
      });

      it('should accept null and undefined values', () => {
        const ingredient: IIngredient = sampleWithRequiredData;
        expectedResult = service.addIngredientToCollectionIfMissing([], null, ingredient, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ingredient);
      });

      it('should return initial array if no Ingredient is added', () => {
        const ingredientCollection: IIngredient[] = [sampleWithRequiredData];
        expectedResult = service.addIngredientToCollectionIfMissing(ingredientCollection, undefined, null);
        expect(expectedResult).toEqual(ingredientCollection);
      });
    });

    describe('compareIngredient', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareIngredient(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareIngredient(entity1, entity2);
        const compareResult2 = service.compareIngredient(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareIngredient(entity1, entity2);
        const compareResult2 = service.compareIngredient(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareIngredient(entity1, entity2);
        const compareResult2 = service.compareIngredient(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
