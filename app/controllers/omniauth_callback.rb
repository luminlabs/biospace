class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
 
  def linkedin
    if current_user
      connect_to_linkedin
    else
      sign_in_via_linkedin
    end
  end
  
private
 
  def connect_to_linkedin
    if current_user.connect_to_linkedin(request.env["omniauth.auth"])
      set_flash_message(:notice, :success, :kind => "LinkedIn")
    else
      set_flash_message(:notice, :failure, :kind => "LinkedIn")
    end
    redirect_to root_url
  end
 
  def sign_in_via_linkedin
    @user = User.find_for_linkedin_oauth(request.env["omniauth.auth"])
 
    if @user
      @user.connect_to_linkedin(request.env["omniauth.auth"])
      sign_in_and_redirect @user, :event => :authentication
      set_flash_message(:notice, :success, :kind => "LinkedIn") if is_navigational_format?
    else
      flash[:notice] = "Couldn't find a user connected to your LinkedIn account.  Please sign in and then connect your account to LinkedIn."
      redirect_to new_user_session_url
    end
  end
end