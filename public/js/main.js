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

    try {
        submitBtnEL.children[0].innerText = "Compressing"
        stepNumberValue(1, '<i class="fa-solid fa-check"></i>')
        
        const form = document.querySelector("form")
        const formData = new FormData(form)
    
        const file = formData.get("file")
    
        if(file.size > 1000000 * 100) {
            throw "Please select a file smaller than 100MB"
        }
    
        if(file.type !== "application/pdf") {
            throw "Please select a valid PDF file to continue"
        }
    
        const data = await fetch("/compress", {
            method: "POST",
            body: formData
        })
    
        if(data.headers.get("Content-Type").includes("application/json")){
            const json = await data.json()
            throw json.error.msg
        } else if(data.headers.get("Content-Type").includes("application/pdf")){
            serverResponsePDF(data, file)
            return
        } else {
            console.error("ERROR: unknown content-type sent by server " + data.headers.get("Content-Type"))
            throw "We're sorry our compression service is not functioning correctly at the momment. please try again later"
        }

    } catch (error) {
        createNotification(error)
        resetStepNumberValues()
        submitBtnEL.children[0].innerText = "Compress"
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