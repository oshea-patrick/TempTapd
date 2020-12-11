// Listener object
export interface Listener {
    id: string;
    name : string;
    favoriteBreweries : string[];
    ownedBreweries : string[];
    likedSongs : string[];
    admin : boolean;
  }