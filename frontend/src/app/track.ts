export interface Track {
  _id: string;
  name: string;
  description: string;
  albumId: string;
  bandId: string;
  category: string;
  usersFavList: [string];
}
