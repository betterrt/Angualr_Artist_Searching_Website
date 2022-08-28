import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  isEmpty:boolean = true;
  // localhost:string = 'http://127.0.0.1:8080';
  //localhost:string = 'https://ruitaoji9832.wl.r.appspot.com/'
  localhost:string = 'https://ruitao-asian.df.r.appspot.com/'
  showSpinner1:boolean = false;

  // Get the access to child component: result
  @ViewChild('results') results:any;
  @ViewChild('input_value') inputValue:any;
 
  constructor(private http: HttpClient) {}

  // Check if the input box is empty
  inputCheck(e:any) {
    if(e.target != null && e.target.value !='') {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
    }
  }
  // Read user input value and search
  startSearch(input:string):any {
    // Used to prevent enter key press to start search if input is empty
    if(input == '') {
      return false;
    }
    this.showSpinner1 = true;
    // Call backend to get search results
    this.http.get(this.localhost + '/search?search_name=' + input).subscribe((response) => {
      // Call the child component's function
      this.results.showList((response as any)._embedded.results);
      this.showSpinner1 = false;
    })
    return false;
  }

  // Clear the input box and all search results
  clear() {
    this.inputValue.nativeElement.value = '';
    this.results.clear();
  }

  
}
