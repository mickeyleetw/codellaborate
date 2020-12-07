let notes='';
let notes_taken = 0;

const socketListener = socket => {
    socket.emit('startup', { notes: notes, notes_taken: notes_taken });

    socket.on('notes_content', (data)=>{
        notes = data.notes;
        io.emit('notes_content', data);
    })

}

module.exports = {socketListener,notes,notes_taken};