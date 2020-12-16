// alert('QQ');
let urlcurrent = (new URL(document.location))
console.log(urlcurrent)
document.getElementById('neweditor').addEventListener('click', newEditor);
// FetchDetails(id, rednerDetails);

//--------------------------------------------------------------------------
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response.json());
        // console.log(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
//--------------------------------------------------------------------------
async function newEditor() {
    fetch('/editor', {method: 'POST'})
    .then(checkStatus)
    .then(async json => {
        const id=json.id;
        const url=json.url;
        // window.location.href = `${urlcurrent}/editor/check`;
        // console.log(urlcurrent)
        const res = await fetch(`${urlcurrent.origin}/editor/check?id=${id}`)
        const editorId = await res.json();
        console.log(editorId)
        window.location.href = `editor?id=${editorId}`;
    })
    .catch(error => {
        console.log('Fetch Error: ', error);
    })
}