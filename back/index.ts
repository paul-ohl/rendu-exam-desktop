const io = require('socket.io')();

const users = [
    { id: 1, name: 'Alice', },
    { id: 2, name: 'Bob', },
    { id: 3, name: 'Charlie', },
    { id: 4, name: 'John', },
    { id: 5, name: 'James', },
];

const conversations = [
    { id: 1, interlocutors: [1, 4], },
    { id: 2, interlocutors: [2, 4], },
    { id: 3, interlocutors: [3, 4], },
    { id: 4, interlocutors: [3, 1], },
    { id: 5, interlocutors: [2, 3, 4], },
    { id: 6, interlocutors: [1, 2, 3, 4], }
];

io.on('connection', (socket: any) => {

    io.emit('user-list', users);
    // // Return user list
    // socket.on('get-users', () => {
    //     io.emi
    // })

    // Allows users to interact with the server
    for (const user of users) {
        socket.on(`order-${user.id}`, (order: string) => {
            console.log(`${user.name} ordered ${order}.`);
            switch (order) {
                case 'chats':
                    let userConversations = conversations
                        .filter((conv) => conv.interlocutors.includes(user.id))
                        // replace having just the id with the whole user object with id and name
                        .map((conv) => {
                            return {
                                ...conv,
                                interlocutors: conv.interlocutors.map((id) => {
                                    return users.find((u) => u.id === id);
                                }),
                            };
                        });
                    io.emit(`order-${user.id}`, userConversations);
                    break;
                default:
                    io.emit(`order-${user.id}`, 'unknown');
            }
        });
    }

    // The sockets for conversations
    for (const conversation of conversations) {
        socket.on(`conversation-${conversation.id}`, (msg: any, sender: any) => {
            console.log(`${sender} sent ${msg} in conversation ${conversation.id}`);
            io.emit(`conversation-${conversation.id}`, msg, sender);
        });
    }

});

io.listen(3000);
