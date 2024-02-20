CREATE TABLE IF NOT EXISTS benutzer (
    id SERIAL PRIMARY KEY,
    benutzername VARCHAR(255) UNIQUE NOT NULL,
    passwort VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS touren (
    id SERIAL PRIMARY KEY,
    benutzer_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    beschreibung TEXT,
    CONSTRAINT fk_benutzer
      FOREIGN KEY(benutzer_id) 
	  REFERENCES benutzer(id)
);

/* Demo-Daten für Touren*/
INSERT INTO touren (benutzer_id, name, beschreibung) VALUES (4, 'Hildesheimer Rose', 'Tour 1 Beschreibung');
INSERT INTO touren (benutzer_id, name, beschreibung) VALUES (6, 'Historische Altstadt', 'Tour 2 Beschreibung');
INSERT INTO touren (benutzer_id, name, beschreibung) VALUES (4, 'Neustadt', 'Tour 3 Beschreibung');
INSERT INTO touren (benutzer_id, name, beschreibung) VALUES (6, 'Weltkulturerbe', 'Tour 4 Beschreibung');
INSERT INTO touren (benutzer_id, name, beschreibung) VALUES (6, 'Kneipentour', 'Tour 4 Beschreibung');
