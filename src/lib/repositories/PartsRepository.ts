import BaseRepository from "./BaseRepository";

export type Part = {
  id: string;
};

export default class PartsRepository extends BaseRepository<Part> {
  constructor() {
    super("parts");
  }
}
