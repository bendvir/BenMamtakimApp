import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-about',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
