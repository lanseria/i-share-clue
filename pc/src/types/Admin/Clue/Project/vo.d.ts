interface AMapBounds {
  className: string;
  northEast: {
    KL: number;
    className: string;
    kT: number;
    lat: number;
    lng: number;
    pos: [number, number];
  };
  southWest: {
    KL: number;
    className: string;
    kT: number;
    lat: number;
    lng: number;
    pos: [number, number];
  };
}

interface ClueMark {
  category: string;
  creator: {
    avatar: string;
    firstName: string;
    id: string;
    isSuperUser: true;
    lastName: string;
    status: string;
    username: string;
  };
  desc: string;
  id: string;
  location: { lat: number; lng: number };
  name: string;
  region: string;
  website: string;
}
