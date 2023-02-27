import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-delete-button-cell',
  templateUrl: './delete-button-cell.component.html',
  styleUrls: ['./delete-button-cell.component.scss']
})
export class DeleteButtonCellComponent implements  ICellRendererAngularComp{

  constructor() { }

  params: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  btnClickedHandler(event: any){
    this.params.clicked(this.params.node.data['username']);
  }

}
