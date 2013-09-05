puts @library = Wistia::Media.find(:all, :params => { :project_id => 444819 })
@library.each do |item|
	if (Media.find_by_mediaId(item.id))
		puts item.id
	else
		puts "New Video"
		Media.create()
		  #   @media.title = params[:media][:title]
    # @media.mediaId = params[:media][:mediaId]
    # @media.created = Date.new(params[:media][:created])
    # @media.created = params[:media][:duration]
	end
end
puts @library[0].id
puts @library.length