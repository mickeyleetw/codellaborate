document.addEventListener("DOMContentLoaded", function () {

    //text area content
jquery    let notes_textarea = $('#code');
    // let notes_textarea = document.getElementById('code');
    let socket = io.connect();

    socket.on('startup', (data) => {
        notes_textarea.val(data.notes);
    });

    // notes_textarea.addEventListener('keyup', () => {
    //     socket.emit("notes_content", { notes: notes_textarea.value })
    // });

    notes_textarea.on('keyup',()=>{
        // const A = $('#code').val();
        // console.log($('#code').val());
        socket.emit("notes_content", { notes: $('#code').val()});
    })

    // notes_textarea.keyup(() => {
    //     socket.emit("notes_content", { notes: $(this).val()});
    // });

    socket.on('notes_content', (data)=>{
        notes_textarea.val(data.notes);
    });





    // socket.on('notes_content', (data) => {
    //         notes_textarea.value = data.notes;
    // });

});