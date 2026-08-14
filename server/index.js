const express = require("express")
const cors = require("cors")
const path = require('path')
require("dotenv").config()

require("./db_connect")

const Router = require("./routes/index")
const app = express()

var whitelist = [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://localhost:4000',
    'http://localhost:5000',
    'https://my-portfolio-x6zy.onrender.com',
    'https://my-portfolio-react-red.vercel.app'
]

var corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {  // ✅ FIXED: was !== -1
            callback(null, true)
        } else {
            callback(new Error('CORS Error: You are not authorized to access this API'))
        }
    }
}

app.use(cors(corsOptions))
app.use(express.json())
app.use("/public", express.static("public"))
app.use("/api", Router)

// Serve React frontend
app.use("", express.static(path.join(__dirname, "admin/build")))
app.get("/{*path}", (req, res) => {                  // ✅ FIXED: was "*"
    res.sendFile(path.join(__dirname, "admin/build", "index.html"))
})

let port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`)
})