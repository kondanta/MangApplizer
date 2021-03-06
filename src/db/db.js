const sqlite3 = require("sqlite3").verbose();

module.exports = class Database {
    Database() {
        console.log("DB Object");
    }
    /**
     * Creates database if it's not exists.
     * @returns {void}
     */
    createDB() {
        const db = new sqlite3.Database("test.sqlite3");

        console.log("Generating Tables!");
        db.serialize(function() {
            db.run("CREATE TABLE IF NOT EXISTS lhs (\
                Name TEXT NOT NULL,\
                Url TEXT NOT NULL,\
                Author TEXT,\
                Genre TEXT,\
                Status TEXT,\
                ReleasedMag TEXT,\
                View INTEGER,\
                Description TEXT)");

            console.log("Database is Ready!");
        });

        db.close();
    }

    /**
     * Filling the database with manga name and url
     * @param  {String} key   Name of the manga
     * @param  {String} value Url links
     * @returns {void}
     */
    insertIntoDB(key, value) {
        const db = new sqlite3.Database("test.sqlite3");
        db.parallelize(function() {
            setTimeout(function() { console.log("Wait Complated!"); }, 6000);
            const stmnt = db.prepare("INSERT INTO lhs VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            stmnt.run(key, value, null, null, null, null, null, null);
            stmnt.finalize();
        });
        db.close();
    }

    /**
     * Prints all of the available information about searched manga
     * @param  {String} name Name of the searched manga.
     * @param {Function} callback Callback function returns error code and data
     * @returns {void}
     */
    getInfo(name, callback) {
        const db = new sqlite3.Database("test.sqlite3");
        db.serialize(function() {
            db.get(`SELECT Author, Genre, Status, ReleasedMag, Description \
                    FROM lhs WHERE Name="${name}"`, function(err, data) {
                (!data) ? callback(404, data): callback(null, data);
            });
        });
        db.close();
    }

    /**
     * Url of the wanted manga. Its actually replacement of the
     * available manga function of lhscans
     * @param  {String}   name     Name of the manga
     * @param  {Function} callback Callback function returns to the url
     * @returns {void}
     */
    returnUrl(name, callback) {
        const db = new sqlite3.Database("test.sqlite3");
        db.serialize(function() {
            db.get(`SELECT Url FROM lhs WHERE Name="${name}"`, function(err, data) {
                (data) ? callback(null, data.Url): callback(404, null);
            });
        });
        db.close();
    }

    /**
     * Inserts additional information like Genre(s), Author into database
     * @param  {String} name    Name of the manga
     * @param  {Array} info     Array that contains all of the information.
     * @param  {String} descrip Description of the manga
     * @returns {void}
     */
    insertAdditionalInfo(name, info) {
        const db = new sqlite3.Database("test.sqlite3");
        const desc = info.pop();
        const pairs = [];
        info.forEach(function(item) {
            let val = item.split(":")[1];
            val = val.trim();
            pairs.push(val);
        });
        db.serialize(function() {
            db.run("UPDATE lhs SET Author=$author, Genre=$genre, Status=$status,\
                    ReleasedMag=$mag, Description=$desc WHERE Name=$name", {
                $name: name,
                $author: pairs[2],
                $genre: pairs[3],
                $status: pairs[4],
                $mag: pairs[5],
                $desc: desc
            });
        });
        db.close();
    }

    /**
     * Compares fresh copy of parsed data with database, does necessary insertions if necessary
     * @param  {String} name Name of the mangas for comparison
     * @param  {String} val  Url links of mangas
     * @returns {void}
     */
    updateWholeDB(name, val) {
        // I could not find any other options to fix class function call.
        const classObj = new Database();
        const db = new sqlite3.Database("test.sqlite3");
        db.serialize(function() {
            db.get(`SELECT Url FROM lhs WHERE Name="${name}"`, function(err, data) {
                if (!data) {
                    classObj.insertIntoDB(name, val);
                }
            });
        });
        db.close();
    }

    /**
     * Returns to name of the mangas
     * @param  {Function} callback Callback function contains the info
     * @returns {void}
     */
    getAllMangaNames(callback) {
        // let names = [];
        const db = new sqlite3.Database("test.sqlite3");

        db.serialize(function() {
            db.each("SELECT Name from lhs", function(error, data) {
                callback(null, data.Name);
            });
        });
        db.close();
    }
};