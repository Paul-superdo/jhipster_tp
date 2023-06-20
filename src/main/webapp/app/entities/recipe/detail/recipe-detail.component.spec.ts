import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RecipeDetailComponent } from './recipe-detail.component';

describe('Recipe Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: RecipeDetailComponent,
              resolve: { recipe: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(RecipeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load recipe on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RecipeDetailComponent);

      // THEN
      expect(instance.recipe).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
