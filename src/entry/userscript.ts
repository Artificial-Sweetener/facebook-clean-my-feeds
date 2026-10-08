// SPDX-License-Identifier: GPL-3.0-only
import { startUserscript } from "./startup";
import { LOG_PREFIX } from "../utils/log";

// Startup failures must not become unhandled rejections in the host Facebook page.
void startUserscript().catch(() => console.warn(`${LOG_PREFIX}Startup could not complete.`));
