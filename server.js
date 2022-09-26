import express from "express"
import compress from "./routes/compress.js"

const app = express(), host = "0.0.0.0", port = process.env.PORT || 8080

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static("public"))
app.use("/compress", compress)

app.listen(port, host, () => console.log(`INIT: server running on PORT: ${port}`))
