module.exports = async function manageGroups(client) {
    const chats = await client.getChats();
    const groups = chats.filter(chat => chat.isGroup);
    return groups.map(group => ({
        id: group.id,
        name: group.name
    }));
};