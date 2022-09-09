import { EntityManager } from "typeorm";
import { HookType } from "./typings/store";
export declare class StoreTransaction {
    manager?: EntityManager;
    onCommit: HookType[];
    onRollback: HookType[];
    onComplete: HookType[];
}
