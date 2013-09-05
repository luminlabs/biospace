class Media < ActiveRecord::Base
  attr_accessible :title,:description,:mediaId,:created,:duration 
  has_one :expert

end
