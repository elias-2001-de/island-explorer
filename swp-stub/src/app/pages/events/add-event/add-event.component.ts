import { AfterViewInit, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/events.service';
import { LocationsService } from 'src/app/services/locations.service';
import { MainauEvent, NewEvent } from '../../../models/event';
import * as Leaflet from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from 'src/app/models/response-message';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css', '../../../../styles.css']
})
export class AddEventComponent implements OnInit, AfterViewInit {

  //instantiate map
  options: Leaflet.MapOptions = {
    layers: [new Leaflet.TileLayer('http://konstrates.uni-konstanz.de:8080/tile/{z}/{x}/{y}.png'),],
    zoom: 16,
    center: new Leaflet.LatLng(47.70475111537479, 9.195249855100897),
    attributionControl: false
  };
  layers: Leaflet.Marker[] = [];

  //set initial
  addEventForm: FormGroup = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    start_date: ['', [Validators.required]],
    end_date: ['', [Validators.required, this.endDateInFutureValidator()]],
    picture: ['', [Validators.required]],
    location: ['', [Validators.required]],
    ticketCategories: this.fb.array([
      this.fb.group({
        category: ['', [Validators.required]],
        price: ['', [Validators.required, Validators.pattern(/^([1-9][0-9]{0,5}|0)(\.[0-9]{1,2})?$/)]],
      })
    ]),
    description_html: ['', [Validators.required]]
  }, { updateOn: 'change' });

  errorMessages: { [key: string]: string } = {
    title: '',
    start_date: 'Kein gültiges Datum',
    end_date: 'Kein gültiges Datum',
    picture: '',
    location: 'Wähle eine Location auf der Karte.',
    category: '',
    price: 'Preis hat kein gültiges Format.',
    description_html: '',
    EndDateNotInFuture: 'End-Datum muss in der Zukunft liegen.',
    StartDateNotBeforeEnd: 'Start-Datum muss vor End-Datum liegen.'
  };


  endDateInFutureValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (new Date(control.value).getTime() < new Date().setHours(23, 59, 59, 999)) {
        return { 'EndDateNotInFuture': true };
      }
      return null;
    };
  }
  startDateBeforeEndValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (new Date(control.value) > new Date(this.addEventForm.get('end_date')?.value)) {
        return { 'StartDateNotBeforeEnd': true };
      }
      return null;
    };
  }

  public event?: MainauEvent;
  public locname = '';
  public currentMarker: Leaflet.Marker = Leaflet.marker([0,0]);
  public new = true;
  public submittedChanges = false;
  public errorMessage: string | undefined = undefined;
  public fd: FormData;
  @ViewChild('placeholder') placeholder?: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute, private eventsService: EventService, private fb: FormBuilder, private locationsService: LocationsService, private http: HttpClient, private renderer: Renderer2, private ngZone: NgZone) {
    this.fd = new FormData();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: params => {
        const id = params.get('id');
        if (id) {
          this.eventsService.getEventById(parseInt(id))
            .subscribe({
              next: ev => {
                this.event = ev;
                this.addEventForm.patchValue({
                  title: this.event.title,
                  start_date: this.event.start_date,
                  end_date: this.event.end_date,
                  location: this.event.location,
                  description_html: this.event.description_html
                });
                //we always send the prices attribute if we get an event           
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.initializeTicketCategories(this.event.prices!);

                //this api does send location, always
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.locname = ev.location!;

                const pictureControl = this.addEventForm.get('picture');
                pictureControl?.clearValidators();
                pictureControl?.updateValueAndValidity();
                this.renderer.setAttribute(this.placeholder?.nativeElement, 'src', '/img/events/' + ev.picture);
              },
              error: err => {
                console.error(err);
              }
            });
          this.new = false;
        }
      },
      error: err => {
        console.error(err);
      }
    });

     //new icon when location is selected
     const selected = Leaflet.icon({
      iconUrl: '/assets/selected-marker-gold.png',
      iconSize: [33, 100]
  });

    this.locationsService.getLocations().subscribe({
      next: () => {
        //console.log(this.locationsService.locations);

        for (const location of this.locationsService.locations) {
          this.layers.push(Leaflet.marker([location.coordinates_lat, location.coordinates_lng], {
            title: location.name
          }));
          //console.log(location.coordinates_lat, location.coordinates_lng);
        }
        
        //this.layers.push(Leaflet.marker([47.6000, 11.198888], {icon: selected}));

        for (const layer of this.layers) {
          layer.on('click', () => {
            this.currentMarker.setIcon(Leaflet.Icon.Default.prototype);
            layer.setIcon(selected);
            this.ngZone.run(() => { //ngZone needed as view won't update otherwise
              if (layer.options.title) {
                this.locname = layer.options.title;
                this.addEventForm.patchValue({
                  location: this.locname
                });
              }
            });
            this.currentMarker = layer;
          });
        }
      },
      error: (err) => {
        console.error(err);
      }
    });

    //start_date validator needs reference to end__date, thus can only be added onInit (in contrast to end_date validator)
    const startDateControl = this.addEventForm.get('start_date');
    startDateControl?.addValidators(this.startDateBeforeEndValidator());
    startDateControl?.updateValueAndValidity();

  }

  ngAfterViewInit(): void {
    if (this.event)
      this.renderer.setAttribute(this.placeholder?.nativeElement, 'src', '/img/events/' + this.event.picture);
  }

  public initializeTicketCategories(categories: { category: string, price: number }[]): void {
    const ticketCategoriesArray = this.addEventForm.controls['ticketCategories'] as FormArray;
    let i = 0;
    for (const cat of categories) {
      const newTicketCategory: FormGroup = this.fb.group({
        category: [cat.category, [Validators.required]],
        price: [cat.price, [Validators.required, Validators.pattern(/^([1-9][0-9]{0,5}|0)(\.[0-9]{1,2})?$/)]]
      });
      ticketCategoriesArray.insert(i, newTicketCategory);
      i++;
    }
    ticketCategoriesArray.removeAt(i); //remove empty category that is added by default
  }

  public getTicketCategories(): FormGroup[] {
    const array = this.addEventForm.controls['ticketCategories'] as FormArray;
    return array.controls as FormGroup[];
  }

  public addTicketCategory(): void {
    const ticketCategoriesArray: FormArray = this.addEventForm.controls['ticketCategories'] as FormArray;
    const arrayLen = ticketCategoriesArray.length;
    const newTicketCategory: FormGroup = this.fb.group({
      category: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern(/^([1-9][0-9]{0,5}|0)(\.[0-9]{1,2})?$/)]]
    });
    ticketCategoriesArray.insert(arrayLen, newTicketCategory);
  }

  public removeTicketCategory(i: number): void {
    const ticketCategoriesArray: FormArray = this.addEventForm.controls['ticketCategories'] as FormArray;
    ticketCategoriesArray.removeAt(i);
  }

  isInvalid(fieldToBeTested: AbstractControl): boolean {
    const field = fieldToBeTested as FormControl;
    if (field) {
      if (field.invalid && (field.touched || field.dirty || field.value !== '')) {
        return true;
      }
    }
    return false;
  }

  //method that is called when buttons are pressed
  async onSubmit(): Promise<void> {
    this.submittedChanges = true; //disable spamming of button
    console.log('Here we gooo: ', this.addEventForm.value);

    if (this.addEventForm.invalid) {
      console.log('Invalid form.');
      this.addEventForm.markAllAsTouched();
      this.submittedChanges = false;
      return;
    }
    else if (this.addEventForm.valid) {

      //upload picture if existing
      let pictureName = '';
      if (this.fd.has('image'))
        pictureName = (await firstValueFrom(this.http.post<ResponseMessage>('/api/image/event', this.fd))).message;

      // Convert ticket categories array object 
      const ticketCategoriesObject = this.addEventForm.controls['ticketCategories'].value.map((obj: { category: string, price: string }) => {
        return {
          category: obj.category.trimEnd(),
          price: Number(obj.price)
        };
      });

      if (this.new) { //add new event
        const newEvent: NewEvent = {
          title: this.addEventForm.value.title.trimEnd(),
          start_date: this.addEventForm.value.start_date.trimEnd(),
          end_date: this.addEventForm.value.end_date.trimEnd(),
          location: this.locname,
          price: ticketCategoriesObject[0].price, //first category's price is used as default
          picture: pictureName,
          description_html: this.addEventForm.value.description_html.trimEnd(),
        };

        console.log('Submitting new');
        this.eventsService.createEvent(newEvent, ticketCategoriesObject).subscribe({
          next: val => {
            console.log(val);
            this.router.navigateByUrl('/events');
            this.errorMessage = undefined;
          },
          error: (err) => {
            console.error(err);
            this.submittedChanges = false;
            this.errorMessage = err.error.message;
          }
        });
      } else if (this.event) { //update existing event, need check if event is not null because of linter
        const updatedEvent: MainauEvent = this.event;
        updatedEvent.title = this.addEventForm.value.title.trimEnd();
        updatedEvent.start_date = this.addEventForm.value.start_date.trimEnd();
        updatedEvent.end_date = this.addEventForm.value.end_date.trimEnd();
        updatedEvent.location = this.locname;
        updatedEvent.price = ticketCategoriesObject[0].price, //first category's price is used as default
          updatedEvent.picture = (pictureName === '') ? this.event.picture : pictureName;
        updatedEvent.description_html = this.addEventForm.value.description_html.trimEnd();

        console.log('Submitting updated');
        this.eventsService.editEvent(updatedEvent, ticketCategoriesObject).subscribe({
          next: () => {
            this.router.navigateByUrl('/events');
            this.errorMessage = undefined;
          },
          error: (err) => {
            console.error(err);
            this.submittedChanges = false;
            this.errorMessage = err.error.message;
          }
        });
      }
    }
  }
 
  abbrechen(): void {
    this.router.navigateByUrl('/events');
  }

  //is only called when a file is added/changed
  public addFile(event: Event): void {
    const target = (event.target as HTMLInputElement);
    if (target.files !== null) {
      this.renderer.setAttribute(this.placeholder?.nativeElement, 'src', URL.createObjectURL(target.files[0]));
      this.fd.set('image', target.files[0], target.files[0].name);
    }
  }

  //is called on every click of the file-select button or clear-button
  public removeFile(event: Event): void {
    const target = (event.target as HTMLInputElement);
    if (!target.files)
      // if this.new is false, then this.event does exist!
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.renderer.setAttribute(this.placeholder?.nativeElement, 'src', this.new ? '/assets/select.png' : ('/img/events/' + this.event!.picture)); //depending on whether we're adding/editing event, placeholder/original image is shown
    this.fd.delete('image');
  }
}
