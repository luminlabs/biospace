puts @library = Wistia::Media.find(:all, :params => { :project_id => 444819 })
@library.each do |item|
	if (Media.find_by_mediaId(item.hashed_id))
		puts item.id
	else
		puts "New Video" 
		thumb_url = item.thumbnail.url.split('=')[0] + "=300x180"
		Media.create(:title => item.name, :mediaId => item.hashed_id, :created => item.updated, :thumbnail => thumb_url, :duration => item.duration)
	end
end
puts @library.length