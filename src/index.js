import process from 'socket:process'
import os from 'socket:os'

import {Peer} from 'socket:peer'

if (process.env.DEBUG) {
    console.log('started in debug mode')
}

console.log(`platform: ${os.platform()}`)

const setColor = c => document.body.style.backgroundColor = `#${c}`

window.addEventListener('DOMContentLoaded', async () => {
    const platform = os.platform()

    console.log(`DOMContentLoaded ${platform}`)

    const keyPair = Peer.createKeys()
    //const clusterId = await Peer.createClusterId()
    const clusterId = "test-cluster"
    console.log(`clusterId: ${clusterId}`)

    const peer = new Peer({
        ...keyPair,
        clusterId
    })
    
    peer.on('message', (value, peer, address, port) => {
        console.log(`message from ${address}:${port}`, value)
        const {color, timestamp} = JSON.parse(value)
        setColor(color)
    })

    document.body.addEventListener('click', async () => {

        const network = await peer.join()
        console.log(JSON.stringify(network, null, 2))
        console.log(`click`)

        const color = Math.floor(Math.random() * 0xFFFFFF).toString(16)

        setColor(color)

        const message = JSON.stringify({
            color,
            timestamp: Date.now()
        })
        console.log(`message: ${message}`)
        console.log(JSON.stringify(peer, null, 2))
        const packet = await peer.emit('message', message)
        console.log(`packet: ${packet}`)
    })

  //setTimeout(() => {
    //const h1 = document.querySelector('h1')
    //h1.textContent = `Hello, ${platform}!`
  //}, 2048)
})
