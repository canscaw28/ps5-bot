export enum Retailers {
  Target = 'target',
}

export type CooldownMap = Record<Retailers, number>;

export const retailSites: Record<Retailers, string> = {
  [Retailers.Target]:
    'https://www.target.com/p/playstation-5-console/-/A-81114595',
};
