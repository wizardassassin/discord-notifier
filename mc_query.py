import sys
import json
from mcstatus import JavaServer

server_ip = "127.0.0.1:25565"

if len(sys.argv) > 1:
    server_ip = sys.argv[1]

server = JavaServer.lookup(server_ip)

try:
    query = server.query()

    # query.software.plugins

    print(json.dumps({"online": True, "version": query.software.version, "motd": query.motd,
          "player_count": query.players.online, "player_max": query.players.max, "players": query.players.names}))
except Exception:
    print(json.dumps({"online": False}))
