# All Games page

## Test case 1

### Actions
1. Open [All Games](http://www.twitch.tv/directory) page.
2. Hover mouse cursor over a game thumbnail.

### Expected results
1. Overlay menu should be visible.

## Test case 2

### Actions
1. Open [All Games](http://www.twitch.tv/directory) page.
2. Block some games on the page.
3. Open Settings window.

### Expected results
1. "Blocked games" tab in Settings window should be active.
2. List with blocked games should be shown.

## Test case 3

### Actions
1. Open [All Games](http://www.twitch.tv/directory) page.
2. Block some games on the page.

### Expected results
1. Tumbnails for blocked games should be hidden.
2. Infinite scroll should triggered loading more thumbanils on the page.

## Test case 4

### Actions
1. Open [All Games](http://www.twitch.tv/directory) page.
2. Block some games on the page.
3. Open Settings window
4. Unblock all games that have been blocked.

### Expected results
1. Thumbnails for unblocked blocked games should become visible.

# Top Channels page

## Test case 1

### Actions
1. Open [Top Channels](http://www.twitch.tv/directory/all) page.
2. Block some channels.

### Expected results
1. Tumbnails for blocked channels should be hidden.
2. Infinite scroll should triggered loading more thumbanils on the page.

## Test case 2

### Actions
1. Open [All Games](http://www.twitch.tv/directory) page.
2. Block some top games that are currently being streamed, like "LoL", "Dota 2", "Hearthstone" etc.
3. Open [Top Channels](http://www.twitch.tv/directory/all) page.

### Expected results
1. Tumbnails for blocked games should be hidden.
2. Infinite scroll should triggered loading more thumbanils on the page.
