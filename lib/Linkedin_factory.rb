class LinkedinFactory
 
  def self.authorize_user(user)
    token = user.user_linkedin_connection.token
    secret = user.user_linkedin_connection.secret
 
    client = LinkedIn::Client.new(LinkedIn.token, LinkedIn.secret)
    client.authorize_from_access(token, secret)
    client
  end
 
  def self.add_share(user, update)
    client = self.authorize_user(user)
    client.add_share(update)
  end
 
end