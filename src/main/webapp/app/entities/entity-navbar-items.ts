import NavbarItem from 'app/layouts/navbar/navbar-item.model';

export const EntityNavbarItems: NavbarItem[] = [
  {
    name: 'Ingredient',
    route: '/ingredient',
    translationKey: 'global.menu.entities.ingredient',
  },
  {
    name: 'Categorie',
    route: '/categorie',
    translationKey: 'global.menu.entities.categorie',
  },
  {
    name: 'Recipe',
    route: '/recipe',
    translationKey: 'global.menu.entities.recipe',
  },
  {
    name: 'Comment',
    route: '/comment',
    translationKey: 'global.menu.entities.comment',
  },
];
