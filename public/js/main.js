const stepNumbersEL = document.querySelectorAll(".number")
const browseEL = document.querySelector(".browse")

browseEL.addEventListener("change", () => {
    stepNumbersEL[1].innerHTML = '2'
    stepNumbersEL[2].innerHTML = '3'
    stepNumbersEL[0].innerHTML = '<i class="fa-solid fa-check"></i>'
})


document.querySelector("input[type='submit'").addEventListener("click", async (e) => {
    stepNumbersEL[1].innerHTML = '<i class="fa-solid fa-check"></i>'
    e.preventDefault()
    const form = document.querySelector("form")
    const formData = new FormData(form)

    const file = formData.get("file")

    if(file.size > 1000000 * 1024){
        console.error("Error: file is larger than 1GB");
        return
    }

    const data = await fetch("/compress", {
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
        
        stepNumbersEL[2].innerHTML = '<i class="fa-solid fa-check"></i>'

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
