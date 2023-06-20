import dayjs from 'dayjs/esm';
import { IRecipe } from 'app/entities/recipe/recipe.model';

export interface IIngredient {
  id: number;
  name?: string | null;
  description?: string | null;
  portions?: number | null;
  creationDate?: dayjs.Dayjs | null;
  recipe?: Pick<IRecipe, 'id'> | null;
}

export type NewIngredient = Omit<IIngredient, 'id'> & { id: null };
