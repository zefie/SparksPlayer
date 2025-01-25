function Track(songName, instrument) {
    // name of the track : bass, guitar, voice, etc.
    this.name = instrument.name;
    this.extension = "mp4"
    // url of the track in the form http://.../track/track_name
    this.url = "multitrack/" + songName + "." + this.extension;
    // decoded audio buffer
    this.decodedBuffer;
    // peaks for drawing the sample
    this.peaks;
    // current volume
    this.volume = 1;
    // current left/right panning
    this.panning;
    // muted / non muted state
    this.muted = false;
    // solo mode ?
    this.solo = false;

    // the web audio nodes that compose this track
    this.sampleNode;
    // volume for this track
    this.volumeNode;
}
