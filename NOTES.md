ChannelThumbsManager
VideoThumbsManager
GameThumbsManager
	hideThumbs(thumbsData)
		foreach hidden thumbs, check if those must be visible and show
	hideThumb(name)
		hide only one thumbnail. To be called by "Block" button in the overlay menu
	showAndHideThumbs(thumbsData)
		foreach all thumbs, check if those must be visible, hide/show accordingly
		
		
		

		
		
		
DOM Listner
	Check if thumbnail
	Hide all
	Raise "GetThambsData" event
	In main window get thumbs data
	In main window raise "RefreshThumbs" event
	Handle "RefreshThumbs" and call ThumbsManager.sshowThumbs(thumbsData)

"Block" button in the overlay menu
	Call hideThumb for correspondent thumbManager
	
Close "Settings" window
	call showAndHideThumbs for all 3 managers asynchronously
	