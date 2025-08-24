import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css']
})

export class SearchFieldComponent {
  @Input()
  label = '';

  @Input()
  type: 'text' | 'number' | 'password' = 'text';

  @Input()
  text = '';

  @Output()
  textChange = new EventEmitter<string>();

  onTextChange(): void {
    this.textChange.emit(this.text);
  }
}

