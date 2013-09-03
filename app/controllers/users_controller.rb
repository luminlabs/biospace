class UsersController < ApplicationController
	include RequestersHelper

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

  def update #post
    #update attributes of that user
    @user = User.find(params[:id])

    if @user.update_attributes(params[:user])
      @user.create_remember_token
      flash[:success] = "Password updated successfully"
      sign_in @user
      redirect_to @user
    else
      @link = "/resetpassword/"+@user.remember_token.to_s
      redirect_to @link
      flash[:error] = "Password problem. Please try again"
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
