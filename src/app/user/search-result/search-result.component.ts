import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../item.model';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @Input() result: Item;

  constructor() { }

  ngOnInit() {}

}
