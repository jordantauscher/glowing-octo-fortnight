import express from "express"
import compress from "./routes/compress.js"

const app = express(), host = "192.168.0.68", port = 8080

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static("public"))
app.use("/compress", compress)

app.listen(port, host, () => console.log(`INIT: server running on http://${host}:${port}`))