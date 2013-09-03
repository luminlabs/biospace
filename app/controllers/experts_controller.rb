class ExpertsController < ApplicationController

  def new
    if current_user === nil
      render 'sessions/new'
    else
      @expert = current_user.expert
      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @expert }
      end 
    end     
  end

  def update
    @expert = current_user.expert
    @expert.update_attributes(params[:expert])
    # @expert.user_id = current_user.user_id
    if @expert.save
      flash.now[:success] = "welcome!"
      redirect_to @expert
    else
      flash.now[:error] = "please try creating profile again."
      render :new
    end
  end

  def show
    if current_user === nil
      render 'sessions/new'
    else
      @expert = current_user.expert
      @skill = Skill.new
    end
  end

  def create_skill
    @expert = Expert.find(params[:id])
    @expert.skills.create(:tag => params[:tag])
    redirect_to @expert
  end

  def edit
    @expert = Expert.find(params[:id])    
  end


  def destroy
    @expert = Expert.find(params[:id])
    @expert.destroy    
  end


  def renderAvailabilities
     @avail_events = '[{"id":1,"title":"Event","start":"2013-07-02T09:00:00","end":"2013-07-02T09:00:00"},'
     @avails = AvailabilityBlock.where("expert_id = ?", params[:id])
     @avails.each do |block|
        @avail_events += block.recurring
     end
     @avail_events[@avail_events.length-1] = ']'
     render :json => @avail_events
  end


  # def change_availability
  #   @avail = availability_block.new()
  # end

  def requests
     @expert = Expert.find(params[:id])
     @event = Event.new

     # @avail_events = "["
     # @avails = AvailabilityBlock.where("expert_id = ?", current_user.id)
     # @avails.each do |block|
     #    @avail_events += block.recurring
     # end
     # @avail_events[@avail_events.length-1] = ']'

    # render :json => @avail_events
  end

  def retrieve_events
  end


  def blarg
    avails = AvailabilityBlock.where("expert_id = ?", current_user.id)
    current_user_avails = []
    
    avails.each do |i|
      current_user_avails << "#" + i.day + i.timeslot
    end

    render :json => current_user_avails
  end


  def change_availability
    if params[:avail] === 'day'
      @avail = AvailabilityBlock.where("expert_id = ? AND day = ? AND timeslot = ?", current_user.id, params[:id][0..2], params[:id][-1]).destroy_all
      render 'experts/schedule'
    else
      day = params[:id][0..2]
      slot = params[:id][-1]
      @avail = AvailabilityBlock.create(:day => day, :timeslot => slot, :expert_id => current_user.id)
      render 'experts/schedule'
    end
  end

  def contribute 
  	
  end


end
