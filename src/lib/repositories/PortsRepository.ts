import BaseRepository from "./BaseRepository";

export type Port = {
  id: string;
};

export default class PortsRepository extends BaseRepository<Port> {
  constructor() {
    super("ports");
  }
}
