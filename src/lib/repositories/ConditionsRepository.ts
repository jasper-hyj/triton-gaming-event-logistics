import BaseRepository from "./BaseRepository";

export type Condition = {
  id: string;
};

export default class ConditionsRepository extends BaseRepository<Condition> {
  constructor() {
    super("conditions");
  }
}
