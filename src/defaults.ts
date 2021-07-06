export enum Retailers {
  Target = 'target',
  BestBuy = 'bestbuy',
  GameStop = 'gamestop',
  Walmart = 'walmart',
  Costco = 'costco',
  Sony = 'sony',
}

export type CooldownMap = Record<Retailers, number>;

export interface InspectionParams {
  url: string;
  selector: string;
  value?: string;
  fn?: Function; // hack for edgecases
  headless: boolean,
}

export const retailerParams: Record<Retailers, InspectionParams> = {
  [Retailers.Target]: {
    url: 'https://www.target.com/p/playstation-5-console/-/A-81114595',
    selector: '[data-test="soldOutBlock"]',
    value: 'Sold out',
    headless: true,
  },
  [Retailers.BestBuy]: {
    url: 'https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149',
    selector: '[data-button-state="SOLD_OUT"]',
    value: 'Sold Out',
    headless: true,
  },
  [Retailers.GameStop]: {
    url: 'https://www.gamestop.com/video-games/playstation-5/consoles/products/playstation-5/11108140.html',
    selector: '[class="delivery-out-of-stock stock-font font-bold"]',
    value: 'Out of stock',
    headless: false,
  },
  [Retailers.Walmart]: {
    url: 'https://www.walmart.com/ip/Sony-PlayStation-5-Video-Game-Console/363472942',
    selector: '[class="price-characteristic"]',
    fn: (x: string) => parseFloat(x.replace(/,/g, '')) > 500,
    headless: false,
  },
  [Retailers.Costco]: {
    url: 'https://www.costco.com/sony-playstation-5-gaming-console-bundle.product.100691489.html',
    selector: '[alt="Out of Stock"]',
    fn: () => true,
    headless: false,
  },
  [Retailers.Sony]: {
    url: 'https://direct.playstation.com/en-us/consoles/console/playstation5-console.3005816',
    selector: '[class="sony-text-body-1"]',
    value: 'Out of Stock',
    headless: true,
  },
};
