let createButton = document.getElementById("button");
let modalOverlay = document.getElementById("modalOverlay");
let closeModalIcon = document.getElementById("close-modal-icon");
let nameOfWebsite = document.getElementById("nameOfWebsite");
let resourceForm = document.getElementById("resource-form");
let linkOfWebsite = document.getElementById("linkOfWebsite");
let descriptionOfWebsite = document.getElementById("descriptionOfWebsite");
let resourcesSection = document.getElementById("resources-section");
let deleteOverlay = document.getElementById("delete-overlay");
let deleteButton = document.getElementById("delete-button");
let cancelButton = document.getElementById("cancel-button");
let resourceWrapper = document.getElementById("resource-wrapper")
let pinWrapper = document.getElementById("pin-div")
let emptyStateDiv = document.getElementById("empty-state")
let shareOverlay = document.getElementById("share-overlay")
let closeShareIcon = document.getElementById("close-share-icon")
let twitter = document.getElementById("twitter")
let pinterest = document.getElementById("pinterest")
let whatsapp = document.getElementById("whatsapp")
let gmail = document.getElementById("gmail")


function revealModalOverlay() {
  modalOverlay.classList.remove("modal-overlay");
  modalOverlay.classList.add("modal-overlay-visible");
  nameOfWebsite.focus();
}
createButton.addEventListener("click", revealModalOverlay);

function closeBackModalOverlay() {
  if (modalOverlay.classList.contains("modal-overlay-visible")) {
    modalOverlay.classList.remove("modal-overlay-visible");
    modalOverlay.classList.add("modal-overlay");
  }
}
closeModalIcon.addEventListener("click", closeBackModalOverlay);


function hideEmptyState() {
  if (resources.length > 0) {
    // Hide empty state
    emptyStateDiv.classList.remove("emptystate-div");
    emptyStateDiv.classList.add("emptystate-div-hide");
    resourcesSection.classList.remove("resources-section-hide")
    resourcesSection.classList.add("resources-section")
  } else {
    // Show empty state
    emptyStateDiv.classList.remove("emptystate-div-hide");
    emptyStateDiv.classList.add("emptystate-div");
    resourcesSection.classList.remove("resources-section")
    resourcesSection.classList.add("resources-section-hide")
  }
}

// 1. when the data is collected from the form and store it in a variable
// 2. Then we put it in an object literal
// 3.Then we arrange the object into an array to make it clean
// 4. Then send them to the local storage becos the LS saves data in frontend like back-end is to front-end. but now we av no backend
// 5. we then get it back from the LS tp print on UI.

// to prevent default behaviour bcos if the form don't see any backend, it throws away the information(data) collected

// lets put the object inside an array outside the handleForm function

let resources = [];
let originalOrder = [] // used when an item is unpinned, allowing you to insert it back into the correct position when an item is pinned and later unpinned.
let pinnedResources = []; //to track only pinned resources for when the page refreshes

// this function was added for the pinicon to update the array
function updateOriginalOrder() {
  originalOrder = Array.from({ length: resources.length }, (_, i) => i);
}

function fetchResources() {
  if (localStorage.getItem("resources")) {
    resources = JSON.parse(localStorage.getItem("resources"));
  }
  if (localStorage.getItem("pinnedResources")) {
    pinnedResources = JSON.parse(localStorage.getItem("pinnedResources"));
  }
  updateOriginalOrder() //and it was called here
  printResourcesOnUI();
}
fetchResources();


/* allResouresFromArray is now storing all the looped items from the resources array now an object and we would use the dot notation to get each dat and store in a variable. */

// storedPrintSiteLink is storing printSiteLink, it was defined outside so we can use it outside the function of printResourcesOnUI.
// it was used in the delete function

let storedPrintSiteLink = "";
let storedPrintSiteName = "";

function printResourcesOnUI() {
  resourcesSection.innerHTML = "";
  resourceWrapper.innerHTML = "";


  resources.forEach(function (allResourcesFromArray, index) {
    let printSiteName = allResourcesFromArray.siteName;
    let printSiteLink = allResourcesFromArray.siteLink;
    let printSiteDescription = allResourcesFromArray.siteDescription;

    let resourceDiv = document.createElement("div");
    resourceDiv.classList.add("resource");

    let nameOfWebsiteDiv = document.createElement("div");
    nameOfWebsiteDiv.classList.add("name-of-website");

    let nameOfWebsiteAnchor = document.createElement("a");
    nameOfWebsiteAnchor.setAttribute("href", `${printSiteLink}`);
    nameOfWebsiteAnchor.setAttribute("target", "_blank");
    nameOfWebsiteAnchor.textContent = printSiteName;


    let copyIcon = document.createElement("i");
    copyIcon.classList.add("fa", "fa-copy");
    copyIcon.setAttribute("title", "Copy")
    copyIcon.addEventListener("click", function copyLink() {
      const range = document.createRange();
      range.selectNode(nameOfWebsiteAnchor);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
    });

    let descriptionOfWebsiteDiv = document.createElement("div");
    descriptionOfWebsiteDiv.classList.add("description-of-website");


    let descriptionOfWebsiteText = document.createElement("p");
    descriptionOfWebsiteText.textContent = printSiteDescription;

    let bottomIconsDiv = document.createElement("div");
    bottomIconsDiv.classList.add("bottom-icons");

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa", "fa-trash");
    deleteIcon.setAttribute("title", "Delete")

    deleteIcon.addEventListener("click", function () {
      storedPrintSiteLink = printSiteLink;
      revealDeleteOverlay();
    });

    let pinIcon = document.createElement("i");
    pinIcon.classList.add("fa", "fa-thumbtack");
    pinIcon.setAttribute("title", "Pin")

    let isPinned = false;
    pinIcon.addEventListener("click", function () {
      isPinned = !isPinned; // Toggle the pinned state
      if (isPinned) {
        pinnedResources.push(resources[index]);
        localStorage.setItem("pinnedResources", JSON.stringify(pinnedResources));
        pinWrapper.append(resourceDiv)
        resourcesSection.append(pinWrapper)
      } else {
        const pinnedIndex = pinnedResources.findIndex((res) => res.siteLink === resources[index].siteLink);
        if (pinnedIndex !== -1) {
          pinnedResources.splice(pinnedIndex, 1);
          localStorage.setItem("pinnedResources", JSON.stringify(pinnedResources));
        }
        pinWrapper.removeChild(resourceDiv)
        resourcesSection.removeChild(pinWrapper)
        resourceWrapper.insertBefore(resourceDiv, resourceWrapper.children[originalOrder[index]])
      }
    });

    let shareIcon = document.createElement("i");
    shareIcon.classList.add("fa", "fa-share-nodes");
    shareIcon.setAttribute("title", "Share");
    shareIcon.addEventListener("click", function () {
      storedPrintSiteLink = printSiteLink
      storedPrintSiteName = printSiteName
      revealShareOverlay()
    }
    )

    bottomIconsDiv.append(deleteIcon, pinIcon, shareIcon);
    descriptionOfWebsiteDiv.append(descriptionOfWebsiteText);
    nameOfWebsiteDiv.append(nameOfWebsiteAnchor, copyIcon);
    resourceDiv.append(
      nameOfWebsiteDiv,
      descriptionOfWebsiteDiv,
      bottomIconsDiv
    );
    resourceWrapper.append(resourceDiv)
    resourcesSection.append(resourceWrapper);
  });
  hideEmptyState()
}

function revealDeleteOverlay() {
  deleteOverlay.classList.remove("delete-overlay");
  deleteOverlay.classList.add("delete-overlay-visible");
}
function revealShareOverlay() {
  shareOverlay.classList.remove("share-overlay");
  shareOverlay.classList.add("share-overlay-visible");
}

function closeBackShareOverlay() {
  if (shareOverlay.classList.contains("share-overlay-visible")) {
    shareOverlay.classList.remove("share-overlay-visible");
    shareOverlay.classList.add("share-overlay");
  }
}
closeShareIcon.addEventListener("click", closeBackShareOverlay)

function closeBackDeleteOverlay() {
  if (deleteOverlay.classList.contains("delete-overlay-visible")) {
    deleteOverlay.classList.remove("delete-overlay-visible");
    deleteOverlay.classList.add("delete-overlay");
  }
}
cancelButton.addEventListener("click", closeBackDeleteOverlay);

function deleteResource(siteLinkToDelete) {
  resources.forEach(function (resource, index) {
    if (resource.siteLink === siteLinkToDelete) {
      resources.splice(index, 1);
    }
  });
  localStorage.setItem("resources", JSON.stringify(resources));
  closeBackDeleteOverlay();
  fetchResources();
}

deleteButton.addEventListener("click", function () {
  deleteResource(storedPrintSiteLink);
});


function twitterShare() {
  const twitterShareURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(storedPrintSiteLink)}`;
  window.open(twitterShareURL, "_blank");
  closeBackShareOverlay()
}
twitter.addEventListener("click", twitterShare)

function pinterestShare() {
  const pinterestShareURL = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(storedPrintSiteLink)}`
  window.open(pinterestShareURL, "_blank")
  closeBackShareOverlay()
}
pinterest.addEventListener("click", pinterestShare)


resourceForm.addEventListener("submit", handleForm);
function handleForm(event) {
  event.preventDefault();

  // put the value inside a variable
  let websiteName = nameOfWebsite.value;
  let websiteURL = linkOfWebsite.value;
  let description = descriptionOfWebsite.value;

  let isValid = true;
  // Basic validation; you can do more
  if (nameOfWebsite.value === "") {
    nameOfWebsite.style.border = "1px solid red";
    isValid = false
  }

  if (linkOfWebsite.value === "") {
    linkOfWebsite.style.border = "1px solid red";
    isValid = false
  } else {
    linkOfWebsite.style.border = ""; // Reset the border
  }

  // if (descriptionOfWebsite.value === "") {
  //   descriptionOfWebsite.style.border = "1px solid red";
  // }

  //   now lets put them in an obeject
  if (isValid) {
    const aCreatedResources = {
      siteName: websiteName,
      siteLink: websiteURL,
      siteDescription: description,
    };

    resources.push(aCreatedResources);
    localStorage.setItem("resources", JSON.stringify(resources));
    fetchResources();
    // activating the fetch resources here again so that anytime item is sent to LS it is fetched immediately.

    // to reset the form after submission
    resourceForm.reset();
    closeBackModalOverlay(); // closes immediately after submission
  }
}
