export interface Track {
  _id: string;
  spotifyId: string;
  name: string;
  href: string;
  imgUrl: string;
  previewURL: string;
  albumId: string;
  albumName: string;
  bandId: string;
  bandName: string;
  category: string;
  grade: number;
  usersFavList: [string];
}
