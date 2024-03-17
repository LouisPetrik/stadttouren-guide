# stadttouren-guide


## Lokal ausführen 

Per git clone oder runterladen das Repo auf eigenen Rechner kopieren.
Dann muss unter /app/data die Datei niedersachsen-latest.osm.pbf abgelegt werden. Diese herunterladen von https://download.geofabrik.de/europe/germany/niedersachsen-latest.osm.pbf, z. B. mit wget: 
```bash 
wget https://download.geofabrik.de/europe/germany/niedersachsen-latest.osm.pbf
```

Sobald die Datei im 

```bash
docker-compose up --build
```

Während die Datenbank, Node.js und das Reverse Proxy relativ schnell starten sollten, dauert der initiale Start des OSRM Servers ein wenig länge - teilweise einige Minuten. Sobald er bereit ist, ist folgendes im Terminal ablesbar: 

```bash
osrm-1   | [info] starting up engines, v5.26.0
osrm-1   | [info] Threads: 12
osrm-1   | [info] IP address: 0.0.0.0
osrm-1   | [info] IP port: 5000
osrm-1   | [info] http 1.1 compression handled by zlib version 1.2.8
osrm-1   | [info] Listening on: 0.0.0.0:5000
osrm-1   | [info] running and waiting for requests
```

## Production version 
Caddy file muss folgendermaßen angepasst werden, um den OSRM Server über die Domain verfügbar zu machen: 
```bash 
stadttouren.online {
  # Versuch, den OSRM Server über domain/path verfügbar zu machen 
  reverse_proxy /route* osrm:5000

  reverse_proxy app:3000
}
```


## Development version 
```bash
http://localhost {
  # Versuch, den OSRM Server über domain/path verfügbar zu machen 
  reverse_proxy /route* osrm:5000

  reverse_proxy app:3000
}
``` 


## Demodaten 

- Benutzername: anja
- E-Mail: anja@web.de 
- Passwort: 123 