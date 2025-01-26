SparksPlayer - A multitrack HTML5 Player for Multitrack MP4
===========
If you know, you know.

Right now it is hard coded and designed for Sparks tracks but in the future I may make it more dynamic if possible or needed.

No sample audio is included, to use this, place the Sparks MP4 files into the `multitrack` directory. Do not use subfolders like MT5 does.

In order to run it, you will need nodeJS and some node modules. Just run `npm install` to download the modules.

To change the port or track path, you can use the following environment variables:
`PORT`, `TRACKS_PATH`. Example: `PORT=9999 TRACKS_PATH=/music/tracks node server.js`

Then run `npm install` and then `node server.js` and open `http://localhost:3000` on a web browser. Then select one of your tracks in the drop down menu.

The multitrack songs are located in the directory assigned to `TRACKS_PATH`, this is by default `client/multitrack`, and a multitrack song is a Sparks MP4 file.

The Sparks support is a dirty hack, but from my testing appears to work.

Web audio pausing or jumping in a song is way unnatural as the AudioBufferSource nodes can be started and stopped only once. This "fire and forget" approach chosen in web audio for these particular nodes means that we need to rebuild partially the web audio graph at each pause or jump. The play/pause/jump and building of the audio graph is done in the song.js file.

Docker quick usage (no installation required)
-----------

```bash
docker-compose up --build
```
