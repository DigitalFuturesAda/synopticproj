# Constraints
There a number of constraints which should ideally be rectified in future revisions. 

- The most notable of which is the start up time. Currently startup takes about ~4 seconds on a high performance device, this is because every audio file is loaded at start up and the entire AlbumMap is constructed. This is required as the app currently doesn't have a notion of lazy loading and the AlbumMap it's self isn't reactive as it does not exist in the VueX store. There is a certain approach that could be implemented which would reduce the application loading times:
    - Push the AlbumMap into the VueX reactive store, this means that Albums can be pushed into the AlbumMap at any point within the lifecycle of the app and the UI will instantly update to reflect the additional Albums. This then means that the Albums could be lazy loaded and displayed as soon as they are loaded. This would then reduce the initial loading screen time to only as long as it takes to load one audio file rather than several.

- The system relies on well formatted compliant metadata tags within the audio files. Whilst this is a major benefit of the system as it uses pre-existing standards rather than defining a custom approach to describe the existence of audio files. The constraint is that some audio files won't have the correct metadata or they may just be blank. There are two fixes to this labeled in order of preference:
    - Use a program (e.g Mp3tag on OSX) to add the correct metadata to audio files before propagating them to the client devices
    - Create a JSON file which can be used as a fall back for audio files that don't have correct metatags. The name would be the key with the value as a dictionary containing the relevant data such as albumName, audioFileName and audioFileCoverImage.

# Assumptions
- The audio files can exist locally and do not need to be stored within a conventional database, in this instance filesystem would constitute a flatfile database.
- The specification stated Rebmem have "worked on a new device", I have made the assumption this device will be capable of either running a lightweight version of Android or a custom Linux distribution.
- No audio files have been provided, therefore I have provided my own sample audio files.
- Every audio file will have an associated album cover. 
- A queue like implementation should be supported, so that when music is queued it will eventually be played using a FIFO (first in first out) like algorithm.
- Users should be able to create playlists of music they would like to listen to.
- There will be a hardware or UI overlayed back button which will communicate with the native back navigation web APIs.
