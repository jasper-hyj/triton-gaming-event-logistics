import BaseRepository from "./BaseRepository";
export type Source = {
  id: string;
};

export default class SourcesRepository extends BaseRepository<Source> {
  constructor() {
    super("sources");
  }
}
