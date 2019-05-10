import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * App configuration service
 */
@Injectable()

export class ConfigService {

  private _startupConfig: any;
  public errorLoading = false;

  /**
    * Constructor
    */
  constructor(private http: HttpClient) { }


  /**
   * Get app configuration on load
   */
  load(): Promise<void> {
    const url = `api/webAppConfig`;

    this._startupConfig = {};

    return this.http.get(url)
        .toPromise()
        .then((data: any) => {this.errorLoading = false; this._startupConfig = data; })
        .catch((err: any) => { this.errorLoading = true; console.error('Error on load configuration'); Promise.resolve(); });
  }

  /**
   * Retrieve webapp configuration
   */
  get startupConfig(): any {
      return this._startupConfig;
  }

  /**
   * Retrieve single webapp configuration key
   * @param key config key
   */
  get(key: any) {
    return this._startupConfig[key];
  }

}
