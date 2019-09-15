import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TvPage } from './tv.page';
import { PlaylistItemComponent } from './playlist-item/playlist-item.component';

const routes: Routes = [
  {
    path: '',
    component: TvPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TvPage, PlaylistItemComponent]
})
export class TvPageModule {}
