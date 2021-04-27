CREATE TABLE recipetags (
    recipeid INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    tagid INTEGER REFERENCES tags(id)
);