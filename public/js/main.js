const browseBtnEL = document.querySelector(".browse")
const submitBtnEL = document.querySelector(".submit")

function resetStepNumberValues() {
    stepNumberValue(1, "2")
    stepNumberValue(2, "3")
    stepNumberValue(0, '<i class="fa-solid fa-check"></i>')
}

browseBtnEL.addEventListener("change", () => {
    resetStepNumberValues()
    browseBtnEL.children[0].innerText = "Selected"
})

submitBtnEL.addEventListener("click", async (e) => {
    e.preventDefault()
    
    stepNumberValue(1, '<i class="fa-solid fa-check"></i>')
    
    const form = document.querySelector("form")
    const formData = new FormData(form)

    const file = formData.get("file")

    if(file.size > 1000000 * 100) {
        fileTooLarge()
        return
    }

    if(file.type !== "application/pdf") {
        fileNotPDF()
        return
    }

    const data = await fetch("/compress", {
        method: "POST",
        body: formData
    })

    submitBtnEL.children[0].innerText = "Compressing"

    if(data.headers.get("Content-Type").includes("application/json")){
        serverResponseJSON(data)
        return
    } else if(data.headers.get("Content-Type").includes("application/pdf")){
        serverResponsePDF(data, file)
        return
    } else {
        serverResponseUnknown()
        return
    }
})

function createNotification(text){
    const notificationEL = document.querySelector(".notification")

    if(notificationEL.innerText === text) return
    
    setTimeout(clearNotifications, 3000)

    notificationEL.innerText = text
    notificationEL.style.display = "block"

    browseBtnEL.style.display = "none"
    submitBtnEL.style.display = "none"


    function clearNotifications(){
        notificationEL.style.display = "none"
        notificationEL.innerText = ""

        browseBtnEL.style.display = "block"
        submitBtnEL.style.display = "block"
    }
}

function stepNumberValue(index, value){
    const stepNumbers = document.querySelectorAll(".number")
    stepNumbers[index].innerHTML = value
}

function fileTooLarge(){
    createNotification("Please select a file smaller than 100MB");
    resetStepNumberValues()
    return
}

function fileNotPDF(){
    createNotification("Please select a valid PDF file to continue")
    resetStepNumberValues()
}

async function serverResponseJSON(data){
    const json = await data.json()
    createNotification(json.error.msg)
}

async function serverResponsePDF(data, file){
    const blob = await data.blob()
        const url = window.URL.createObjectURL(new Blob([blob]))
        
        stepNumberValue(2, '<i class="fa-solid fa-check"></i>')
        const link = document.querySelector("#dl")
        link.href = url
        link.download = file.name.replace(".pdf", " compressed.pdf")
        link.click()

        browseBtnEL.children[0].innerText = "Browse"
        submitBtnEL.children[0].innerText = "Compress"

        window.URL.revokeObjectURL(url)
}

function serverResponseUnknown(){
    stepNumberValue(2, "3")
    console.error("ERROR: unknown content-type sent by server " + data.headers.get("Content-Type"))
}
