let createButtom = document.getElementById("button")
let modalOverlay = document.getElementById("modalOverlay")
let closeModalIcon = document.getElementById("close-modal-icon")
let nameOfWebsite = document.getElementById("nameOfWebsite")
let resourceForm = document.getElementById("resource-form")
let linkOfWebsite = document.getElementById("linkOfWebsite")
let descriptionOfWebsite = document.getElementById("descriptionOfWebsite")
let resourcesSection = document.getElementById("resources-section")



function revealModalOverlay(){
    modalOverlay.classList.remove("modal-overlay")
    modalOverlay.classList.add("modal-overlay-visible")
    nameOfWebsite.focus()
}
createButtom.addEventListener("click", revealModalOverlay)

function closeBackModalOverlay(){
    if(modalOverlay.classList.contains("modal-overlay-visible")){
        modalOverlay.classList.remove("modal-overlay-visible")
        modalOverlay.classList.add("modal-overlay")
    }
}
closeModalIcon.addEventListener("click", closeBackModalOverlay)

// 1. when the data is collected from the form and store it in a variable
// 2. Then we put it in an object literal
// 3.Then we arrange the object into an array to make it clean
// 4. Then send them to the local storage becos the LS saves data in frontend like back-endis to front-end. but now we av no backend
// 5. we then get it back from the LS tp print on UI.

// to prevent default behaviour bcos if the form don't see any backend, it throws away the information(data) collected

// lets put the object inside an array outside the handleForm function

let resources = []

function fetchResources(){
    if(localStorage.getItem("resources")) {
        resources = JSON.parse(localStorage.getItem("resources"))
    }
    printResourcesOnUI()
}
fetchResources()

/* allResouresFromArray is now storing all the looped items from the resources array now an object and we would use the dot notation to get each dat and store in a variable. */
function printResourcesOnUI() {
    
    resourcesSection.innerHTML = ""

    resources.forEach(function(allResourcesFromArray){
        let printSiteName = allResourcesFromArray.siteName
        let printSiteLink = allResourcesFromArray.siteLink
        let printSiteDescription = allResourcesFromArray.siteDescription

        let resourceDiv = document.createElement("div")
        resourceDiv.classList.add("resource")

        let nameOfWebsiteDiv = document.createElement("div")
        nameOfWebsiteDiv.classList.add("name-of-website")

        let nameOfWebsiteAnchor = document.createElement("a")
        nameOfWebsiteAnchor.setAttribute("href", `${printSiteLink}`)
        nameOfWebsiteAnchor.setAttribute("target", "_blank")
        nameOfWebsiteAnchor.textContent = printSiteName

        let deleteIcon = document.createElement("i")
        deleteIcon.classList.add("fa", "fa-trash")
        deleteIcon.setAttribute(`onclick`, `deleteResource('${printSiteLink}')`)

        let descriptionOfWebsiteDiv = document.createElement("div")
        descriptionOfWebsiteDiv.classList.add("description-of-website")

        let descriptionOfWebsiteText = document.createElement("p")
        descriptionOfWebsiteText.textContent = printSiteDescription
        

        descriptionOfWebsiteDiv.append(descriptionOfWebsiteText)
        nameOfWebsiteDiv.append(nameOfWebsiteAnchor, deleteIcon)
        resourceDiv.append(nameOfWebsiteDiv, descriptionOfWebsiteDiv)
        resourcesSection.append(resourceDiv)
    })
}

function deleteResource(printSiteLink){
    resources.forEach(function(resource, index){
        if(resource.siteLink === printSiteLink) {
            resources.splice(index, 1)
        }
    })
    localStorage.setItem("resources", JSON.stringify(resources))
    fetchResources()
}


resourceForm.addEventListener("submit", handleForm)
function handleForm(event) {
    event.preventDefault()
    // put the value inside a variable
    let websiteName = nameOfWebsite.value
    let websiteURL = linkOfWebsite.value
    let description = descriptionOfWebsite.value
    

// Basic validation; you can do more
    if(nameOfWebsite.value === ""){
        nameOfWebsite.style.border = "1px solid red"
    }
    
    if(linkOfWebsite.value === ""){
        linkOfWebsite.style.border = "1px solid red"
    }

    if(descriptionOfWebsite.value === ""){
        descriptionOfWebsite.style.border = "1px solid red"
    }

//   now lets put them in an obeject
    const aCreatedResources = {
        siteName: websiteName,
        siteLink: websiteURL,
        siteDescription: description
    }

    resources.push(aCreatedResources)
    localStorage.setItem("resources", JSON.stringify(resources))
    fetchResources()
    // activating the fetch resources here again so that anytime item is sent to LS it is fetched immediately.


// to reset the form after submission 
    resourceForm.reset()
    closeBackModalOverlay()
    // closes immediately after submission
}

