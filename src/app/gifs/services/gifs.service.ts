import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SeachResponse } from '../interfaces/gifs.interface';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifsList: Gif[]=[];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'XoIwghypG9mch3uiuG6jPVoxyNsIBaqV';
  private serviceUrl: string= 'https://api.giphy.com/v1/gifs';




  constructor(private http:HttpClient) {
    this.loadLocalStorage();
    console.log('Gif service ready');
  }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  private organizeHistory(tag:string){
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory= this.tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory))
  }

  private loadLocalStorage():void{
    if(!localStorage.getItem('history')){
      return;
    }
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
    this.searchTag(this.tagsHistory[0]);
  }

  async searchTag( tag:string ):Promise<void>{

    if( tag.length===0)return;
    this.organizeHistory(tag);
    this.searchTagClick(tag);

    //'https://api.giphy.com/v1/gifs/search?api_key=XoIwghypG9mch3uiuG6jPVoxyNsIBaqV&q=valorant&limit=10')

  }

  async searchTagClick( tag:string ):Promise<void>{

    const params= new HttpParams()
      .set('api_key',this.apiKey)
      .set('limit','10')
      .set('q',tag)

    this.http.get<SeachResponse>(`${this.serviceUrl}/search`, {params })
      .subscribe( resp => {

        this.gifsList= resp.data;

      });

    //'https://api.giphy.com/v1/gifs/search?api_key=XoIwghypG9mch3uiuG6jPVoxyNsIBaqV&q=valorant&limit=10')

  }




}
