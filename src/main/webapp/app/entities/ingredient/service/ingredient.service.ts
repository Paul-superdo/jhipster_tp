import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIngredient, NewIngredient } from '../ingredient.model';

export type PartialUpdateIngredient = Partial<IIngredient> & Pick<IIngredient, 'id'>;

type RestOf<T extends IIngredient | NewIngredient> = Omit<T, 'creationDate'> & {
  creationDate?: string | null;
};

export type RestIngredient = RestOf<IIngredient>;

export type NewRestIngredient = RestOf<NewIngredient>;

export type PartialUpdateRestIngredient = RestOf<PartialUpdateIngredient>;

export type EntityResponseType = HttpResponse<IIngredient>;
export type EntityArrayResponseType = HttpResponse<IIngredient[]>;

@Injectable({ providedIn: 'root' })
export class IngredientService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ingredients');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ingredient: NewIngredient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ingredient);
    return this.http
      .post<RestIngredient>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(ingredient: IIngredient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ingredient);
    return this.http
      .put<RestIngredient>(`${this.resourceUrl}/${this.getIngredientIdentifier(ingredient)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(ingredient: PartialUpdateIngredient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ingredient);
    return this.http
      .patch<RestIngredient>(`${this.resourceUrl}/${this.getIngredientIdentifier(ingredient)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestIngredient>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestIngredient[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getIngredientIdentifier(ingredient: Pick<IIngredient, 'id'>): number {
    return ingredient.id;
  }

  compareIngredient(o1: Pick<IIngredient, 'id'> | null, o2: Pick<IIngredient, 'id'> | null): boolean {
    return o1 && o2 ? this.getIngredientIdentifier(o1) === this.getIngredientIdentifier(o2) : o1 === o2;
  }

  addIngredientToCollectionIfMissing<Type extends Pick<IIngredient, 'id'>>(
    ingredientCollection: Type[],
    ...ingredientsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ingredients: Type[] = ingredientsToCheck.filter(isPresent);
    if (ingredients.length > 0) {
      const ingredientCollectionIdentifiers = ingredientCollection.map(ingredientItem => this.getIngredientIdentifier(ingredientItem)!);
      const ingredientsToAdd = ingredients.filter(ingredientItem => {
        const ingredientIdentifier = this.getIngredientIdentifier(ingredientItem);
        if (ingredientCollectionIdentifiers.includes(ingredientIdentifier)) {
          return false;
        }
        ingredientCollectionIdentifiers.push(ingredientIdentifier);
        return true;
      });
      return [...ingredientsToAdd, ...ingredientCollection];
    }
    return ingredientCollection;
  }

  protected convertDateFromClient<T extends IIngredient | NewIngredient | PartialUpdateIngredient>(ingredient: T): RestOf<T> {
    return {
      ...ingredient,
      creationDate: ingredient.creationDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restIngredient: RestIngredient): IIngredient {
    return {
      ...restIngredient,
      creationDate: restIngredient.creationDate ? dayjs(restIngredient.creationDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestIngredient>): HttpResponse<IIngredient> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestIngredient[]>): HttpResponse<IIngredient[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
