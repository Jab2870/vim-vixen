import { injectable } from 'tsyringe';
import * as urls from '../../shared/urls';

declare namespace browser.browserSettings.homepageOverride {

  type BrowserSettings = {
    value: string;
    levelOfControl: LevelOfControlType;
  };

  type LevelOfControlType =
    'not_controllable' |
    'controlled_by_other_extensions' |
    'controllable_by_this_extension' |
    'controlled_by_this_extension';

  function get(param: object): Promise<BrowserSettings>;
}

declare namespace browser.proxy.settings {

  type BrowserSettings = {
    value: string;
  };

  function get(param: object): Promise<BrowserSettings>;
  function set(param: object): Promise<any>;
  function clear(param: object): Promise<any>;
}

@injectable()
export default class BrowserSettingRepository {
  async getHomepageUrls(): Promise<string[]> {
    let { value } = await browser.browserSettings.homepageOverride.get({});
    return value.split('|').map(urls.normalizeUrl);
  }
}

export class ProxyRepository {
  private clearProxySettings(): Promise<any>{
    return browser.proxy.settings.clear({});
  }

  private setProxySettings(address: string): Promise<any>{
    return browser.proxy.settings.set({value: {
      proxyType: "manual",
      http: address,
      httpProxyAll: true
    }});
  }

  set(address: string): Promise<any> {
    if( address.toLowerCase() == 'none' ){
      return this.clearProxySettings();
    }
    return this.setProxySettings(address);
  }
}

