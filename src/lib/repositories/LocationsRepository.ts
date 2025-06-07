import BaseRepository from "./BaseRepository";

export type Location = {
  id: string;
  building: string;
  direction: string;
};

export default class LocationsRepository extends BaseRepository<Location> {
  constructor() {
    super("locations");
  }
}
