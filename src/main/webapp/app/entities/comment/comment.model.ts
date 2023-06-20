import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IRecipe } from 'app/entities/recipe/recipe.model';

export interface IComment {
  id: number;
  comment?: string | null;
  date?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id'> | null;
  recipe?: Pick<IRecipe, 'id'> | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
