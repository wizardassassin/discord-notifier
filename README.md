# discord-notifier

Sends a Discord webhook based on customizable system events.

# Getting Started

The code currently requires manual editing to add events.  
The systemStatus works on linux systems with systemctl.  
pm2 needs to be started with systemd for the program to detect a system shutdown event.

Make sure to have Node.js and pm2 installed.

Clone the repo

```bash
git clone https://github.com/wizardassassin/discord-notifier.git
cd discord-notifier
```

Install the dependencies

```bash
npm install
```

Rename the .env.example to .env and modify corresponding variables

```bash
cp .env.example .env
nano .env
```

Run the code

```
pm2 start ecosystem.config.cjs
```

# References

https://stackoverflow.com/questions/25166085/how-can-a-systemd-controlled-service-distinguish-between-shutdown-and-reboot  
https://unix.stackexchange.com/questions/401240/how-can-a-systemd-service-detect-that-system-is-going-to-power-off  
https://stackoverflow.com/questions/5749891/why-didnt-this-program-receive-sigterm-on-init-reboot-shutdown  
https://stackoverflow.com/questions/23622051/how-to-forcibly-keep-a-node-js-process-from-terminating  
https://discordjs.guide/popular-topics/webhooks.html  
https://pm2.keymetrics.io/docs/usage/startup/
