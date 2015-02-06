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
2. Open Settings window.

### Expected results
1. List with blocked games should be shown.

## Test case 3

### Actions
1. Open [All Games](http://www.twitch.tv/directory) page.
2. Block some games on the page.

### Expected results
1. Thumbnails for blocked games should be hidden.

## Test case 4

### Actions
1. Repeat all steps from the previous test case.
2. Refresh the page.

### Expected results
1. Thumbnails for blocked games should be hidden.

## Test case 5

### Actions
1. Open [All Games](http://www.twitch.tv/directory) page.
2. Block some games on the page.
3. Open Settings window.
4. Unblock all games that have been blocked.

### Expected results
1. Thumbnails for unblocked games should be visible.

## Test case 6

### Actions
1. Repeat all steps from the previous test case.
2. Refresh the page.

### Expected results
1. Thumbnails for unblocked games should be visible.

## Test case 7

### Actions
1. Open [Top Channels](http://www.twitch.tv/directory/all) page.
2. Block some channels on the page.
3. Open [All Games](http://www.twitch.tv/directory) page.
4. Open Settings window.
5. Unblock all channels that have been blocked.

### Expected results
1. Page content should stay unchanged.

## Test case 8

### Actions
1. Repeat all steps from the previous test case.
2. Refresh the page.

### Expected results
1. Page content should stay unchanged.
