import { Component } from '@angular/core';
import $ from 'jquery'; // Import jQuery

@Component({
  selector: 'app-annualtax',
  standalone: true,
  imports: [],
  templateUrl: './annualtax.component.html',
  styleUrl: './annualtax.component.css'
})
export class AnnualtaxComponent {

 ngAfterViewInit(): void {
    // Initialize jQuery click handlers
    this.initializeCollapsibleRows();
  }

  ngOnDestroy(): void {
    $('.toggle-nested').off('click');
  }

  private initializeCollapsibleRows(): void {
    $('.toggle-nested').on('click', function() {
      var $button = $(this);
      var $nestedTable = $button.closest('tr').nextUntil('tr:not(.nested-table)', '.nested-table');

      if ($nestedTable.is(':visible')) {
        $nestedTable.hide().addClass('d-none'); // Hide and add d-none class
         $button.removeClass('mdi mdi-minus-circle toggle-neste')
        $button.addClass('mdi mdi-plus-circle toggle-nested')
      } else {
        $nestedTable.show().removeClass('d-none'); // Show and remove d-none class
        $button.removeClass('mdi mdi-plus-circle toggle-neste')
        $button.addClass('mdi mdi-minus-circle toggle-nested')
      }
    });
  }

}