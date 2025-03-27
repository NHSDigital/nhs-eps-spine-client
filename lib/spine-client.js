import { LiveSpineClient } from "./live-spine-client";
import { SandboxSpineClient } from "./sandbox-spine-client";
export function createSpineClient(logger) {
    const liveMode = process.env.TargetSpineServer !== "sandbox";
    if (liveMode) {
        return new LiveSpineClient(logger);
    }
    else {
        return new SandboxSpineClient();
    }
}
//# sourceMappingURL=spine-client.js.map
