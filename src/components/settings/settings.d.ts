export type Root = Root2[];

export interface Root2 {
  _id: string;
  general: General;
  profile: Profile;
  timestamp: Timestamp;
  __v: number;
}

export interface Id {
  $oid: string;
}

export interface General {
  website: Website;
  dashboard: Dashboard;
  apis: Apis;
  security: Security;
}

export interface Website {
  details: Details;
  homepage: Homepage;
}

export interface Details {
  name: string;
  domain: string;
  favicon: object | null;
}

export interface Homepage {
  header: string;
  subheader: string;
  background: object | null;
}

export interface Dashboard {
  dark_mode: boolean;
}

export interface Apis {
  server: Server;
  cld: Cld;
}

export interface Server {
  api_url: string;
}

export interface Cld {
  enable_cld: boolean;
  api_url: string;
  api_key: string;
  cloud_name: string;
  preset_name: string;
}

export interface Security {
  https_protocol: boolean;
}

export interface Profile {
  bio: Bio;
  portfolio_pdf: PortfolioPdf;
  contact: Contact[];
}

export interface Bio {
  statement: Statement;
  additional: Additional[];
}

export interface Statement {
  html: string;
}

export interface Additional {
  _id: Id2;
  title: string;
  html: string;
}

export interface Id2 {
  $oid: string;
}

export interface PortfolioPdf {
  url: string;
}

export interface Contact {
  _id: Id3;
  email: string;
  socialmedia: Socialmedum[];
}

export interface Id3 {
  $oid: string;
}

export interface Socialmedum {
  _id: Id4;
  platform: Platform;
}

export interface Id4 {
  $oid: string;
}

export interface Platform {
  name: Name;
  profile_url: string;
  username: string;
}

export interface Name {
  default: string;
}

export interface Timestamp {
  $date: string;
}
