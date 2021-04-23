CREATE TABLE recipetags (
    recipeid INTEGER REFERENCES recipes(id),
    tagid INTEGER REFERENCES tags(id)
);