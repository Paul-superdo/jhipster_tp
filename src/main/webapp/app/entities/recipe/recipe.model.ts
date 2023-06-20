import dayjs from 'dayjs/esm';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';
import { IUser } from 'app/entities/user/user.model';
import { ICategorie } from 'app/entities/categorie/categorie.model';

export interface IRecipe {
  id: number;
  title?: string | null;
  description?: string | null;
  cookingTime?: string | null;
  rate?: number | null;
  imageUrl?: string | null;
  creationDate?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id'> | null;
  categorie?: Pick<ICategorie, 'id'> | null;
  ingredient?: Pick<IIngredient, 'id'> | null;
}

export type NewRecipe = Omit<IRecipe, 'id'> & { id: null };
