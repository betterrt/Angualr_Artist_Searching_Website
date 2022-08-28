import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  // localhost:string = 'http://127.0.0.1:8080';
  //localhost:string = 'https://ruitaoji9832.wl.r.appspot.com/'
  localhost:string = 'https://ruitao-asian.df.r.appspot.com/'

  artists:{
    src: string,
    name: string,
    id: string,
    num: number
  }[] = [];

  artworks:{
    src: string,
    name: string,
    time: string,
    id: string,
    num: number
  }[] = [];

  genes:{
    src: string,
    name: string
  }[] = [];


  nameAndDays:string = '';
  nationality:string = '';
  biography:string = '';
  geneArtworkSrc:string = '';
  geneArtworkName:string = '';
  geneArtworkTime:string = '';

  colorControl:string[] = [];
  isClicked:boolean[] = [];

  showNoResults:boolean = false;
  showNoArtworks:boolean = false;
  showNoCategories:boolean = false;
  showLists:boolean = false;
  showInfos:boolean = false;
  showSpinner1:boolean = false;
  showSpinner2:boolean = false;

  constructor(private http: HttpClient) { 
    // Initialize the artist card-body background colors
    for(let i:number = 0; i < 10; ++i) {
      this.colorControl[i] = '#205375';
      this.isClicked[i] = false;
    }
  }
 
  ngOnInit(): void {
  }

  // A function will be called by father component:app-root
  // Clear all results
  clear() {
    this.showLists = false;
    this.showInfos = false;
    this.showNoResults = false;
    this.showNoArtworks = false;
    this.showNoCategories = false;
    // Clear all arrays
    this.artists.splice(0);
    this.artworks.splice(0);
    this.genes.splice(0);

  }

  setDarker(number:number) {
    this.colorControl[number] = '#112B3C';
  }
  setLighter(number:number) {
    if(!this.isClicked[number]) {
      this.colorControl[number] = '#205375';
    }
  }
  setAndShowInfo(number:number) {
    // Show Info and artworks
    this.showInfo(number);
    // Set the cards background color
    this.setDarker(number);
    this.isClicked[number] = true;
    let size:number = this.artists.length;
    for(let i:number = 0; i < size; ++i) {
      if(i != number) {
        this.colorControl[i] = '#205375';
        this.isClicked[i] = false;
      }
    } 
  }

  // A function will be called by father component:app-root
  // Show result list
  showList(answer:any) {
    // Clear the artists array
    this.artists.splice(0);
    this.showNoResults = false;
    this.showInfos = false;
    for(let i:number = 0; i < 10; ++i) {
      this.colorControl[i] = '#205375';
      this.isClicked[i] = false;
    }
    let num:number = 0;
    for(let value of answer) {
      if(value['og_type'] != 'artist') {
        continue;
      }
      // Set the image of artists
      let imgsrc:string = '../../../assets/artsy_logo.svg'; 
      if(value['_links']['thumbnail']['href'] != '/assets/shared/missing_image.png') {
        imgsrc = value['_links']['thumbnail']['href'];
      }
      this.artists.push({src: imgsrc,
                         name: value['title'],
                         id: value['_links']['self']['href'],
                         num: num});
      num++;
    }
    if(num == 0) {
      this.showLists = false;
      this.showNoResults = true;
      return;
    }
    this.showLists = true;
  }

  // Show info and artworks
  showInfo(number:number) {
    this.showNoArtworks = false;
    this.showSpinner1 = true;
    this.showInfos = false;
    // Clear the artworks array
    this.artworks.splice(0);
    this.http.get(this.localhost + '/artists_artworks?id=' + this.artists[number].id).subscribe((response) => {
      let res = response as any;
      // handle artist infos
      this.nameAndDays = res.artist.name + ' (' + res.artist.birthday + ' - ' + res.artist.deathday + ')';
      this.nationality = res.artist.nationality;
      this.biography = res.artist.biography;
      // handle artworks
      let size:number = res.artwork._embedded.artworks.length;
      for(let i:number = 0; i < size; ++i) {
        this.artworks.push({src: res.artwork._embedded.artworks[i]._links.thumbnail.href,
                            name: res.artwork._embedded.artworks[i].title,
                            time: res.artwork._embedded.artworks[i].date,
                            id: res.artwork._embedded.artworks[i].id,
                            num : i});
      }
      this.showSpinner1 = false;
      if(size == 0) {
        this.showNoArtworks = true;
      }
      this.showInfos = true;
    });
  }

  // Show categories
  showGene(num:number) {
    // First show the already loaded part of the modal
    this.geneArtworkSrc = this.artworks[num].src;
    this.geneArtworkName = this.artworks[num].name;
    this.geneArtworkTime = this.artworks[num].time;
    let artworkId:string = this.artworks[num].id;
    // Clear the genes array
    this.genes.splice(0);
    this.showNoCategories = false;
    this.showSpinner2 = true;
    this.http.get(this.localhost + '/genes?id=' + artworkId).subscribe((response) => {
      let res = response as any;
      let size:number = res._embedded.genes.length;
      for(let i:number = 0; i < size; ++i) {
        this.genes.push({src: res._embedded.genes[i]._links.thumbnail.href, 
                         name: res._embedded.genes[i].name});
      }
      this.showSpinner2 = false;
      if(size == 0) {
        this.showNoCategories = true;
      }
    });
  }

  

}
