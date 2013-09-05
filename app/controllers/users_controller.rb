class UsersController < ApplicationController

  def index  
  end

  # def show
  #   # @expert = Expert.new
  #   # if current_user.expert.active === true
  #     # render 'experts/show'
  #   # else
  #   render 'users/show'
  #   # end
  #   # @user = User.find(params[:id])
  # end


  def forgotpassword #get
  end

  def reset #get

    if @user = User.find_by_remember_token(params[:remember_token])
      render '/reset'
    else
      redirect_to '/not_found'
    end

  end

  def dashboard
    @requests_made_by = Event.where("user_id = ?", current_user.id)
    @requests_made_of = Event.where("expert_id = ?", current_user.id)

  end

  def not_found
  end

  def search
    experts = Expert.all
    @users = User.all
  end 
end

def library 

end
