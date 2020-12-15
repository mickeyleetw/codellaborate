// alert('QQ');
let urlcurrent = (new URL(document.location))
document.getElementById('neweditor').addEventListener('click', newEditor);
// FetchDetails(id, rednerDetails);

//--------------------------------------------------------------------------
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
        // console.log(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
//--------------------------------------------------------------------------
async function newEditor() {
    fetch('/editor', {method: 'POST'})
    .then(checkStatus)
    .then(json => {
        const id=json.id;
        const url=json.url;
        window.location.href = `${urlcurrent}/editor/check`;
        fetch(`${urlcurrent}/editor/check?id=${id}`)
    }).catch(error => {
        console.log('Fetch Error: ', error);
    })

}