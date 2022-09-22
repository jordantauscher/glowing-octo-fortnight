document.querySelector("button[type='submit'").addEventListener("click", async (e) => {
    e.preventDefault()
    const form = document.querySelector("form")
    const formData = new FormData(form)

    const file = formData.get("file")

    if(file.size > 1000000 * 1024){
        console.error("Error: file is larger than 1GB");
        return
    }

    const data = await fetch("https://pdfcompressordemo.up.railway.app/compress", {
        method: "POST",
        body: formData
    })

    if(data.headers.get("Content-Type").includes("application/json")){
        const json = await data.json()
        console.log(json)
        return
    } else if(data.headers.get("Content-Type").includes("application/pdf")){
        const blob = await data.blob()
        const url = window.URL.createObjectURL(new Blob([blob]))

        const link = document.querySelector("#dl")
        link.href = url
        link.download = file.name
        link.click()

        window.URL.revokeObjectURL(url)
        return
    } else {
        console.error("ERROR: unknown content-type sent by server " + data.headers.get("Content-Type"))
        return
    }
})
