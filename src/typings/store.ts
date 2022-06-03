import { EntityManager } from "typeorm";

export type Store = Map<string, EntityManager> | undefined