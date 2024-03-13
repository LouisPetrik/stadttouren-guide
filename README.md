# stadttouren-guide

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