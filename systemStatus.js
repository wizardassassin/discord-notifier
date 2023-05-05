import { exec } from "child_process";
import { promisify } from "util";

const promiseExec = promisify(exec);

async function getStatusSystemd() {
    try {
        const status = await promiseExec(
            `systemctl list-jobs | egrep -q 'shutdown.target.*start' && echo "shutting down" || echo "not shutting down"; systemctl list-jobs | egrep -q 'reboot.target.*start' && echo "-> rebooting" || echo "-> not rebooting"; systemctl list-jobs | egrep -q 'halt.target.*start' && echo "-> halting" || echo "-> not halting"; systemctl list-jobs | egrep -q 'poweroff.target.*start' && echo "-> powering down" || echo "-> not powering down"`
        );
        return status.stdout;
    } catch (error) {
        console.error(error);
    }
    return "unknown";
}

export default getStatusSystemd;
