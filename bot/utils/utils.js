const {engagement, MessageEmbed} = require('./initialize')

/// Attempts to create Engagement Sphere and returns command reply
async function createSphere(msg) {
    // let created = await engagement.sphereCreated(msg.guidlId)

    // if(created) return "Engagement Sphere already created for server"

    let [name, symbol] = tokenize(msg.content)

    if (!name || !symbol) return "Please reenter command formatted as: `!create 'Token Name' 'SYMBOL'`"
    console.log(`${name}-${symbol}`)
    // Will throw an error if token symbol already exists for an engagement sphere
    try {
        await engagement.create(msg.guidlId, name, symbol)
        return 'Engagement Sphere created!'

    } catch (err) {
        return "Token SYMBOL already in use, please choose another!"
    }
}

function tokenize(command) {
    let nameStart = command.toLowerCase().indexOf("name:") 
    let symbolStart = command.toLowerCase().indexOf("symbol:") 
  
    let name = command.slice(nameStart + 5, symbolStart < nameStart ? undefined : symbolStart).trim()
    
    let symbol = command.slice(symbolStart + 7, symbolStart > nameStart ? undefined : symbolStart).trim()
  
    return [name, symbol]
}



exports.createSphere = createSphere;
exports.tokenize = tokenize