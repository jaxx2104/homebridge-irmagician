# homebridge-irmagcian

irMagician on HomeBridge Platform.

# Installation

1. Install homebridge using: sudo npm install -g homebridge
2. Install this plugin using: sudo npm install -g homebridge-irmagician
3. Update your configuration.
4. In the case raspberry pi

```
cd /usr/lib/node_modules/homebridge-irmagcian/
npm rebuild serialport --build-from-source
```

# Configuration

Configuration sample:

```
"accessories": [
    {
        "accessory": "irMagician",
        "name": "temperature",
        "type": "temp"
    }
]

```
