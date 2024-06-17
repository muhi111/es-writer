/// <reference types="chrome"/>

function indexContents() {

  console.log("indexContents called")  // 関数呼び出しの確認用ログ

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0] && tabs[0].id !== undefined) {
      chrome.scripting.executeScript({
        target : {tabId: tabs[0].id},
        func: getActiveTabHTML
      }, result => {
        if (result) {
          var html_source = result[0].result
          console.log("html loaded")
        }
        fetch("http://localhost:8080/getAnswers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ html: html_source })
        })
          .then(res => {
            if (!res.ok) {
              console.error("Network response was not ok", res.statusText)
              return;
            }
            return res.json()
          })
          .then(answers => {
            console.log("Received answers:", answers) // 受け取ったデータをコンソールに出力
            replaceTextareaText(answers)
          });
      })
    }
  })
}

function getActiveTabHTML() {
  return document.documentElement.outerHTML;
}

function replaceTextareaText(answers: any) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0] && tabs[0].id !== undefined) {
      chrome.scripting.executeScript({
        target : {tabId: tabs[0].id},
        func: replaceTextareas,
        args: [answers]
      })
    }
  })
}

function replaceTextareas(answers: any) {
  const allTextareas = document.getElementsByTagName("textarea")
  Array.from(allTextareas).forEach((textarea, index) => {
    if (answers[index]) {
      textarea.value = answers[index].answer
    }
  })
}

export default indexContents