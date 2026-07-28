export type ClanNetworkNode = SetMetadata['relationships']['nodes'][number];
export type ClanNetworkLink = SetMetadata['relationships']['links'][number];

export type ClanMembershipStatus = 'current-clan' | 'other-clan' | 'no-clan';

export type LegendEntry = {
  label: string;
  color: string;
  shape?: string;
  dashed?: boolean;
};
