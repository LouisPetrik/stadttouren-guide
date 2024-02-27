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

/* Quasi eine später-geplante-Touren-Tabelle in der App als Liste */
CREATE TABLE IF NOT EXISTS geplante_touren (
    id SERIAL PRIMARY KEY,
    benutzer_id INTEGER NOT NULL,
    tour_id INTEGER NOT NULL, 
    durchgefuehrt BOOLEAN DEFAULT FALSE, 
    CONSTRAINT fk_benutzer_geplante_touren
      FOREIGN KEY(benutzer_id) 
      REFERENCES benutzer(id),
    CONSTRAINT fk_touren_geplante_touren
      FOREIGN KEY(tour_id) 
      REFERENCES touren(id)
);


/* Demo-Daten für Touren*/
INSERT INTO touren (benutzer_id, name, beschreibung) VALUES (4, 'Hildesheimer Rose', 'Eine Tour entlang der Wege, die die Hildesheimer Rose beschreibt (neuer container)');
INSERT INTO touren (benutzer_id, name, beschreibung) VALUES (6, 'Historische Altstadt', 'Erkunde die historische Altstadt Hildesheims, rund um den Marktplatz');
INSERT INTO touren (benutzer_id, name, beschreibung) VALUES (4, 'Neustadt', 'Rund um die Lamberti-Kirche erstreckt sich die Neustadt');
INSERT INTO touren (benutzer_id, name, beschreibung) VALUES (6, 'Weltkulturerbe', 'Hildesheim hat nicht nur ein Weltkulturerbe, sondern gleich zwei! Eine Tour zur St. Michaelis und zum Dom');
INSERT INTO touren (benutzer_id, name, beschreibung) VALUES (6, 'Kneipentour', 'Eine Tour durch die Kneipen Hildesheims');
