export enum Retailers {
  Target = 'target',
}

export type CooldownMap = Record<Retailers, number>;

export interface InspectionParams {
  url: string;
  selector: string;
  value: string;
}

export const retailSites: Record<Retailers, InspectionParams> = {
  [Retailers.Target]: {
    url: 'https://www.target.com/p/playstation-5-console/-/A-81114595',
    selector: '[data-test="soldOutBlock"]',
    value: 'Sold out',
  },
};
