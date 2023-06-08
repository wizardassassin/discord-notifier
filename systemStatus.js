import { exec } from "child_process";
import { promisify } from "util";

const promiseExec = promisify(exec);

export async function getSystemStatus() {
    try {
        const status = await promiseExec(
            `systemctl list-jobs | egrep -q 'shutdown.target.*start' && echo "shutting down" || echo "not shutting down"; systemctl list-jobs | egrep -q 'reboot.target.*start' && echo "-> rebooting" || echo "-> not rebooting"; systemctl list-jobs | egrep -q 'halt.target.*start' && echo "-> halting" || echo "-> not halting"; systemctl list-jobs | egrep -q 'poweroff.target.*start' && echo "-> powering down" || echo "-> not powering down"`
        );
        const msg = status.stdout.trim();
        if (msg.startsWith("not shutting down")) return "not shutting down";
        if (msg.includes("-> rebooting")) return "rebooting";
        if (msg.includes("-> halting")) return "halting";
        if (msg.includes("-> powering down")) return "powering down";
        return msg;
    } catch (error) {
        if (error.code === 255) {
            if (process.platform === "win32") {
                console.error("Windows doesn't support systemctl.");
            } else {
                console.error(error.stderr.trim());
            }
        } else {
            console.error(error);
        }
    }
    return "unknown";
}
