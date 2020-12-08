document.addEventListener("DOMContentLoaded", function () {

    //text area content
    let notes_textarea = document.getElementById('code');
    let socket = io.connect();

    socket.on('startup', (data) => {
        notes_textarea.value = data.notes;
    });

    notes_textarea.addEventListener('keyup', () => {
        // socket.emit("notes_content", { notes: notes_textarea.value })
    });

    socket.on('notes_content', (data) => {
            notes_textarea.value = data.notes;
    });

});