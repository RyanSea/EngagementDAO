const {engagement, MessageEmbed} = require('./initialize')

/// Attempts to create Engagement Sphere and returns command reply
async function createSphere(msg) {
    let created = await engagement.sphereCreated(msg.guidlId)

    if(created) return "Engagement Sphere already created for server"

    let name = msg.content.split("'")[1]
    let symbol = msg.content.split("'")[3]

    if (!name || !symbol) return "Please reenter command formatted as: `!create 'Token Name' 'SYMBOL'`"

    // Will throw an error if token symbol already exists for an engagement sphere
    try {
        await engagement.create(msg.guidlId, name, symbol)
        return 'Engagement Sphere created!'

    } catch (err) {
        return "Token SYMBOL already in use, please choose another!"
    }
}



exports.createSphere = createSphere;