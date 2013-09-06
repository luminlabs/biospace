class UsersController < Devise::SessionsController
  before_filter :authenticate_user!
  def index 
  end

  def create
    super
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
  def library 
    @library = Media.all
  end



  def not_found
  end

  def search
    experts = Expert.all
    @users = User.all
  end 
end


