class MediasController < ApplicationController
  before_filter :authenticate_user!
  def index
    
  end

  def new
    @media = Media.new
    
  end
  def contribute
    @media = Media.new
    
  end

  def create
    @media = Media.new
    @media.title = params[:media][:title]
    @media.mediaId = params[:media][:mediaId]
    @media.created = Date.new(params[:media][:created])
    @media.duration = params[:media][:duration]
    @media.thumbnail = params[:media][:thumbnail]
  
    @media.save   

  end
  def screening
     @media = Media.find(params[:id])
     @id_string = "wistia_" + @media.mediaId
  end
  def show
    @media = Media.find(params[:id])
  end
  def toggle_confirmed

     @media = Media.find(params[:id])
     if @media.confirmed
        @media.confirmed = false
     else
        @media.confirmed = true
     end
     @media.save
     render "/dashboard"

  end
  def edit
    @media = Media.find(params[:id])
  end

  def update
    @media = Media.find(params[:id])
    @media.update_attributes(params[:media])
    render :show    
  end

  def destroy
    media = Media.find(params[:id])
    media.delete
    redirect_to medias_path    
  end

end
