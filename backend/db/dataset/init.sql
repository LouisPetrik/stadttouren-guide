/* Zuerst die bestehenden Tabellen löschen, falls sie existieren */
DROP TABLE IF EXISTS benutzer CASCADE;
DROP TABLE IF EXISTS touren CASCADE;
DROP TABLE IF EXISTS geplante_touren CASCADE;

/* Dann die Tabellen neu erstellen */


CREATE TABLE benutzer (
    id SERIAL PRIMARY KEY,
    benutzername VARCHAR(255) UNIQUE NOT NULL,
    passwort VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE touren (
    id SERIAL PRIMARY KEY,
    benutzer_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    beschreibung TEXT,
    punkte JSONB, 
    CONSTRAINT fk_benutzer
      FOREIGN KEY(benutzer_id) 
	  REFERENCES benutzer(id)
);

/* Quasi eine später-geplante-Touren-Tabelle in der App als Liste */
CREATE TABLE geplante_touren (
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

/* Demo Daten für Benutzer */
INSERT INTO benutzer (benutzername, passwort, email) VALUES
('testnutzer', '123456', 'test@mail.com'),
('arnd', '123', 'arnd@web.de'),
('test', 'test', 'test@web.de'),
('malte', '$2b$10$yZdxuUgrA.ZNxjHZuQJ01Oj70OUAN6Cg2zYS0fqbuSQHN0rUmJTfG', 'malte@web.de'),
('karl', '$2b$10$ZVdJXm/kJnjAZGMkFR.VBuy0xv9xLZd84cYFdPaDs0kQPZiZpRL.O', 'karl@web.de'),
('anja', '$2b$10$3KiLeVMTZmMoYwcEJvO3uedV6HjkoKCElCylxxeKkekuzkm0/MW/2', 'anja@web.de');



/* Demo-Daten für Touren*/
INSERT INTO touren (benutzer_id, name, beschreibung, punkte) VALUES (2, 'Hildesheimer Rose', 'Eine Tour entlang der Wege, die die Hildesheimer Rose beschreibt', '[{"lat": 52.134119,"lng": 9.974163},{"lat": 52.136336228609395,"lng": 9.966466426849367}]');
INSERT INTO touren (benutzer_id, name, beschreibung, punkte) VALUES (4, 'Historische Altstadt', 'Erkunde die historische Altstadt Hildesheims, rund um den Marktplatz', '[{"lat": 52.134119,"lng": 9.974163},{"lat": 52.136336228609395,"lng": 9.966466426849367},{"lat": 52.14207571628058,"lng": 9.962255033897238}]');
INSERT INTO touren (benutzer_id, name, beschreibung, punkte) VALUES (5, 'Neustadt', 'Rund um die Lamberti-Kirche erstreckt sich die Neustadt', '[{"lat": 52.134119,"lng": 9.974163},{"lat": 52.136336228609395,"lng": 9.966466426849367}]');
INSERT INTO touren (benutzer_id, name, beschreibung, punkte) VALUES (6, 'Weltkulturerbe', 'Hildesheim hat nicht nur ein Weltkulturerbe, sondern gleich zwei! Eine Tour zur St. Michaelis und zum Dom', '[{"lat": 52.134119,"lng": 9.974163},{"lat": 52.136336228609395,"lng": 9.966466426849367},{"lat": 52.14207571628058,"lng": 9.962255033897238}]');
INSERT INTO touren (benutzer_id, name, beschreibung, punkte) VALUES (2, 'Kneipentour', 'Eine Tour durch die Kneipen Hildesheims', '[{"lat": 52.134119,"lng": 9.974163},{"lat": 52.136336228609395,"lng": 9.966466426849367}]');
INSERT INTO touren (benutzer_id, name, beschreibung, punkte) VALUES (6, 'Uni Standorte', 'Lerne die Standorte der Universität hildesheim kennen', '[
    {
        "lat": 52.134119,
        "lng": 9.974163
    },
    {
        "lat": 52.136336228609395,
        "lng": 9.966466426849367
    },
    {
        "lat": 52.136229321154055,
        "lng": 9.970559124194551
    },
    {
        "lat": 52.134158,
        "lng": 9.967912
    }, 
    {
    "lat": 52.16998373599523,
    "lng": 9.936017990112306
    }
]');  
