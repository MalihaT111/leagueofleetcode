import { RedisClientOptions } from ".";
import RedisCommandsQueue from "./commands-queue";
import { RedisArgument } from "../..";
import RedisSocket from "./socket";
export declare const MAINTENANCE_EVENTS: {
    readonly PAUSE_WRITING: "pause-writing";
    readonly RESUME_WRITING: "resume-writing";
    readonly TIMEOUTS_UPDATE: "timeouts-update";
};
export type DiagnosticsEvent = {
    type: string;
    timestamp: number;
    data?: Object;
};
export declare const dbgMaintenance: (...args: any[]) => void;
export declare const emitDiagnostics: (event: DiagnosticsEvent) => void;
export interface MaintenanceUpdate {
    relaxedCommandTimeout?: number;
    relaxedSocketTimeout?: number;
}
interface Client {
    _ejectSocket: () => RedisSocket;
    _insertSocket: (socket: RedisSocket) => void;
    _pause: () => void;
    _unpause: () => void;
    _maintenanceUpdate: (update: MaintenanceUpdate) => void;
    duplicate: () => Client;
    connect: () => Promise<Client>;
    destroy: () => void;
    on: (event: string, callback: (value: unknown) => void) => void;
}
export default class EnterpriseMaintenanceManager {
    #private;
    static setupDefaultMaintOptions(options: RedisClientOptions): void;
    static getHandshakeCommand(options: RedisClientOptions): Promise<{
        cmd: Array<RedisArgument>;
        errorHandler: (error: Error) => void;
    } | undefined>;
    constructor(commandsQueue: RedisCommandsQueue, client: Client, options: RedisClientOptions);
}
export type MovingEndpointType = "auto" | "internal-ip" | "internal-fqdn" | "external-ip" | "external-fqdn" | "none";
export {};
//# sourceMappingURL=enterprise-maintenance-manager.d.ts.map