import BaseRepository from "./BaseRepository";

export type Type = {
  id: string;
};

export default class TypesRepository extends BaseRepository<Type> {
  constructor() {
    super("types");
  }
}
