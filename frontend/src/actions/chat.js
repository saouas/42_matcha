export const addMessage = data => ({
    type: 'ADD_MESSAGE',
    message: {
        me: data.me,
        date: data.date,
        text: data.text
    }
})

export const setMessages = data => ({
    type: 'SET_MESSAGES',
    messages: data
})