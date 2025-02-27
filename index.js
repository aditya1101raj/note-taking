const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
    fs.readdir(`./files`, function (err, files) {
        res.render("index", { files: files });
    });
});

app.get("/files/:filename", function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

app.post('/create', function (req, res) {
    const filename = req.body.title.split(' ').join('') + ".txt";
    fs.writeFile(`./files/${filename}`, req.body.details, function (err) {
        res.redirect("/");
    });
});

// DELETE Route
app.post('/delete/:filename', function (req, res) {
    const filePath = `./files/${req.params.filename}`;
    fs.unlink(filePath, function (err) {
        if (err) {
            console.error("Error deleting file:", err);
        }
        res.redirect("/");
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
