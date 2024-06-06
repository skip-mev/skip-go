import * as os from "os";

export const concurrency = Math.max(1, (os.cpus() || { length: 1 }).length - 1);
