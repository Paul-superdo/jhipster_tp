import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRecipe, NewRecipe } from '../recipe.model';

export type PartialUpdateRecipe = Partial<IRecipe> & Pick<IRecipe, 'id'>;

type RestOf<T extends IRecipe | NewRecipe> = Omit<T, 'creationDate'> & {
  creationDate?: string | null;
};

export type RestRecipe = RestOf<IRecipe>;

export type NewRestRecipe = RestOf<NewRecipe>;

export type PartialUpdateRestRecipe = RestOf<PartialUpdateRecipe>;

export type EntityResponseType = HttpResponse<IRecipe>;
export type EntityArrayResponseType = HttpResponse<IRecipe[]>;

@Injectable({ providedIn: 'root' })
export class RecipeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/recipes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(recipe: NewRecipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recipe);
    return this.http
      .post<RestRecipe>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(recipe: IRecipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recipe);
    return this.http
      .put<RestRecipe>(`${this.resourceUrl}/${this.getRecipeIdentifier(recipe)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(recipe: PartialUpdateRecipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recipe);
    return this.http
      .patch<RestRecipe>(`${this.resourceUrl}/${this.getRecipeIdentifier(recipe)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestRecipe>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestRecipe[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRecipeIdentifier(recipe: Pick<IRecipe, 'id'>): number {
    return recipe.id;
  }

  compareRecipe(o1: Pick<IRecipe, 'id'> | null, o2: Pick<IRecipe, 'id'> | null): boolean {
    return o1 && o2 ? this.getRecipeIdentifier(o1) === this.getRecipeIdentifier(o2) : o1 === o2;
  }

  addRecipeToCollectionIfMissing<Type extends Pick<IRecipe, 'id'>>(
    recipeCollection: Type[],
    ...recipesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const recipes: Type[] = recipesToCheck.filter(isPresent);
    if (recipes.length > 0) {
      const recipeCollectionIdentifiers = recipeCollection.map(recipeItem => this.getRecipeIdentifier(recipeItem)!);
      const recipesToAdd = recipes.filter(recipeItem => {
        const recipeIdentifier = this.getRecipeIdentifier(recipeItem);
        if (recipeCollectionIdentifiers.includes(recipeIdentifier)) {
          return false;
        }
        recipeCollectionIdentifiers.push(recipeIdentifier);
        return true;
      });
      return [...recipesToAdd, ...recipeCollection];
    }
    return recipeCollection;
  }

  protected convertDateFromClient<T extends IRecipe | NewRecipe | PartialUpdateRecipe>(recipe: T): RestOf<T> {
    return {
      ...recipe,
      creationDate: recipe.creationDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restRecipe: RestRecipe): IRecipe {
    return {
      ...restRecipe,
      creationDate: restRecipe.creationDate ? dayjs(restRecipe.creationDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestRecipe>): HttpResponse<IRecipe> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestRecipe[]>): HttpResponse<IRecipe[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
