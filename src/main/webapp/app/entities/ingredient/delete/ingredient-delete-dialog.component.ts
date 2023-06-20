import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IIngredient } from '../ingredient.model';
import { IngredientService } from '../service/ingredient.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './ingredient-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class IngredientDeleteDialogComponent {
  ingredient?: IIngredient;

  constructor(protected ingredientService: IngredientService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ingredientService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
