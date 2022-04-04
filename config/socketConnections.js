const Notify = require('../models/Notification');

module.exports = {
  addNewProduct: (socket) => {
    socket.on('notify', (data)=>{
      socket.broadcast.emit('notifyRes', data)
    })
  },
};
