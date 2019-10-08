import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from 'src/app/user/item.model';

@Component({
  selector: 'app-playlist-item',
  templateUrl: './playlist-item.component.html',
  styleUrls: ['./playlist-item.component.scss'],
})
export class PlaylistItemComponent implements OnInit {
  @Input() result: Item;
  @Input() currentId: string;
  @Output() playSong: EventEmitter<any> = new EventEmitter();
  @Output() deleteSong: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  deleteMe() {
    if(this.currentId !== this.result._id)
      this.deleteSong.emit([this.result]);
  }

  playMe() {
    if(this.currentId !== this.result._id)
      this.playSong.emit([this.result._id]);
  }
}