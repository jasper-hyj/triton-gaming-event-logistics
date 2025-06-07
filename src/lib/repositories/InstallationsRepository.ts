import BaseRepository from "./BaseRepository";

export type Installation = {
  id: string;
  platform: string;
  size: number;
};

export default class InstallationsRepository extends BaseRepository<Installation> {
  constructor() {
    super("installations");
  }
}
