function postForm(form) {
    form.classList.add('hidden')
    document.getElementById('thanks').classList.remove('hidden')
    if (form.email.value) postEvent('submit', form.email.value)
    else postEvent('submit')
    return false
}

function postEvent(event_type, user_identifier) {
    return fetch('https://qwr5burgf73e27ywl76ortrk4q0snkqx.lambda-url.us-east-1.on.aws', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type, user_identifier }),
    })
}