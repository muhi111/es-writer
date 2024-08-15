import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// export const api_endpoint = "http://localhost:8080"
export const api_endpoint = "https://es-writer.trap.show/"

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "getHTML") {
    sendResponse({ html: document.documentElement.outerHTML })
  } else if (request.action === "replaceTextareas") {
    const allTextareas = document.getElementsByTagName("textarea")
    Array.from(allTextareas).forEach((textarea, index) => {
      if (request.answers[index]) {
        textarea.value = request.answers[index].answer
      }
    })
    sendResponse({ success: true })
  }
})
