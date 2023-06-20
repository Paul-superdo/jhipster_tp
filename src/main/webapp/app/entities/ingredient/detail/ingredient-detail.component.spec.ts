import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IngredientDetailComponent } from './ingredient-detail.component';

describe('Ingredient Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: IngredientDetailComponent,
              resolve: { ingredient: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(IngredientDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load ingredient on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', IngredientDetailComponent);

      // THEN
      expect(instance.ingredient).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
