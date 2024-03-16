const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();

const PORT = 8000;

//Middleware
app.use(express.urlencoded({extended: false}));

//Routes
//For browser
app.get("/users", (req, res) => {
    
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>`
    return res.send(html);
});

// For mobile app
app.get("/api/users", (req, res) => {
    return res.json(users);
})


app
.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id) ;
    const user = users.find((user) => user.id===id);
    return res.json(user);
})
.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        users.splice(index, 1);                                                   // Remove the user from the array
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            if (err) {
                return res.status(500).json({ error: "Failed to delete user." });
            }
            return res.json({ status: "Successfully Removed" });
        });
    }
})
.patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const user = users.find((user) => user.id === id)
    const updatedUser = { ...user, ...body };
    updatedUser.id=id;
    users[id-1]=updatedUser

   fs.writeFile('MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({ status: "Success", updatedUser })})
   });

app.post("/api/users", (req, res) => {
    const body = req.body;
    let idLength = users.length + 1 ;
    users.push({ id: idLength , ...body});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json({status: "Successful", idLength});
    })
});

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));